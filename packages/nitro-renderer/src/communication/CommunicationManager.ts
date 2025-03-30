import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { ICommunicationManager, IConnection, IMessageConfiguration, IMessageEvent } from '#renderer/api';
import { NitroEventType } from '#renderer/events';
import { GetTickerTime } from '#renderer/utils';
import { EventStore, GetConfigValue } from '@nitrodevco/nitro-shared';
import { NitroMessages } from './NitroMessages';
import { SocketConnection } from './SocketConnection';
import { AuthenticatedEvent, ClientHelloMessageComposer, ClientPingEvent, InfoRetrieveMessageComposer, PongMessageComposer, SSOTicketMessageComposer, UniqueIDMessageComposer } from './messages';

// Assume this is a new message type for the challenge response
interface ChallengeResponseMessageComposer {
    new (response: string): any; // Adjust based on your message framework
}

export class CommunicationManager implements ICommunicationManager {
    private _connection: IConnection = new SocketConnection();
    private _messages: IMessageConfiguration = new NitroMessages();
    private _pongInterval: NodeJS.Timeout | null = null;
    private _clientSecret = 'ThisIsYourSecureKey';

    private async generateMachineID(): Promise<string> {
        try {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            return `IID-${result.visitorId}`;
        } catch (error) {
            console.error('Failed to generate Machine ID:', error);
            return 'FAILED';
        }
    }

    private generateCanvasProof(nonce: string): string {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return 'FAILED';

        // Use nonce and secret to create a unique drawing
        const text = `${nonce}-${this._clientSecret}`;
        ctx.font = '16px Arial';
        ctx.fillStyle = '#123456';
        ctx.fillText(text, 10, 50);
        ctx.fillRect(20, 20, 100, 100);

        const dataUrl = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < dataUrl.length; i++) {
            hash = (hash << 5) - hash + dataUrl.charCodeAt(i);
            hash &= hash; // Ensure 32-bit integer
        }
        return hash.toString(16); // Return as hex
    }

    constructor() {
        this._connection.registerMessages(this._messages);
    }

    public async init(): Promise<void> {
        EventStore.getState().subscribe(NitroEventType.SOCKET_CLOSED, () => {
            this.stopPong();
        });

        return new Promise((resolve, reject) => {
            let nonceReceived = false;
            let challengeNonce: string | null = null;

            // Handle server nonce (assume server sends a "ChallengeEvent" with a nonce)
            this._connection.addMessageEvent({
                onEvent: (event: any) => { // Replace 'any' with your actual event type
                    if (event.type === 'ChallengeEvent') { // Define this event type
                        challengeNonce = event.nonce;
                        nonceReceived = true;
                    }
                }
            } as IMessageEvent);

            EventStore.getState().subscribe(NitroEventType.SOCKET_OPENED, async () => {
                if (GetConfigValue<boolean>('socket.pongManually', false)) this.startPong();

                const machineId = await this.generateMachineID();
                this._connection.send(new ClientHelloMessageComposer(null, null, null, null));
                this._connection.send(new SSOTicketMessageComposer(GetConfigValue('socket.ticket', ''), GetTickerTime()));
                this._connection.send(new UniqueIDMessageComposer(machineId, '', ''));

                console.log('MachineID:', machineId);

                // Wait for nonce and respond with proof
                const waitForNonce = async () => {
                    while (!nonceReceived) {
                        await new Promise(r => setTimeout(r, 100)); // Poll every 100ms
                    }
                    if (!challengeNonce) throw new Error('No nonce received');
                    const proof = this.generateCanvasProof(challengeNonce);
                    this._connection.send(new (class implements ChallengeResponseMessageComposer {
                        constructor(response: string) {
                            this.response = response;
                        }
                        response: string;
                    })(proof)); // Replace with your actual message composer
                };
                await waitForNonce();
            });

            EventStore.getState().subscribe(NitroEventType.SOCKET_ERROR, () => {
                reject();
            });

            this._connection.addMessageEvent(new ClientPingEvent((event: ClientPingEvent) => this.sendPong()));
            this._connection.addMessageEvent(new AuthenticatedEvent((event: AuthenticatedEvent) => {
                this._connection.authenticated();
                resolve();
                event.connection.send(new InfoRetrieveMessageComposer());
            }));

            this._connection.init(GetConfigValue<string>('socket.url'));
        });
    }

    protected startPong(): void {
        if (this._pongInterval) this.stopPong();
        this._pongInterval = setInterval(() => this.sendPong(), GetConfigValue<number>('socket.pongInterval', 20000));
    }

    protected stopPong(): void {
        if (!this._pongInterval) return;
        clearInterval(this._pongInterval);
        this._pongInterval = null;
    }

    protected sendPong(): void {
        this._connection?.send(new PongMessageComposer());
    }

    public registerMessageEvent(event: IMessageEvent): IMessageEvent {
        if (this._connection) this._connection.addMessageEvent(event);
        return event;
    }

    public removeMessageEvent(event: IMessageEvent): void {
        if (!this._connection) return;
        this._connection.removeMessageEvent(event);
    }

    public get connection(): IConnection {
        return this._connection;
    }
}