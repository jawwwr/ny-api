import * as socketIO from 'socket.io';

export interface INYGooseInitPayload {
    token: string;
}

export interface INYGooseSocket extends socketIO.Socket {
    ny_goose_room?: string;
}