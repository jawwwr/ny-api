import { ON_DISCONNECT, ON_INITIALIZE_NY_GOOSE_SOCKET } from '../constants';

import { onDisconnect, onInitializeNYGoose } from './listener';

import * as socketIO from 'socket.io';

import { INYGooseInitPayload } from './types';

export function onConnection(socket: socketIO.Socket) {
    console.log(`User connected with socket id: ${socket.id}`);
    socket.on(ON_INITIALIZE_NY_GOOSE_SOCKET, (payload: INYGooseInitPayload) =>
        onInitializeNYGoose(socket, payload),
    );
    socket.on(ON_DISCONNECT, () => onDisconnect(socket));
}

export function onError(socket: socketIO.Socket) {
    console.log(`Some error occured: ${socket.id}`);
}