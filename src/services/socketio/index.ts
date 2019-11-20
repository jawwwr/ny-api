import * as socketIO from 'socket.io';

import { ON_CONNECTION, ON_ERROR } from './constants';

import { onConnection as onNYGooseConnection, onError as onNYGooseError } from './ny-goose';

export const SOCKET: any = {
  io: undefined
};

export default function initializeSocket(socket_io: any) {
  SOCKET.io = socket_io;
  SOCKET.io.on(ON_CONNECTION, onConnect);
  SOCKET.io.on(ON_ERROR, onError);
}

/**
 * Place all your socket service connections here
 *
 * @param {SOCKET} socket
 */
async function onConnect(socket: socketIO.Socket) {
  onNYGooseConnection(socket);
}

async function onError(socket: socketIO.Socket) {
  onNYGooseError(socket);
}
