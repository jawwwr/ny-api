import { INYGooseInitPayload, INYGooseSocket } from './types';

export async function onInitializeNYGoose(
    socket: INYGooseSocket,
    payload: INYGooseInitPayload,
) {
    console.log(`Initialized socket from frontend with id: ${socket.id}`);
    // should put emitters on emitter file
    socket.emit('initialized in backend', {
        message: 'Socket emission from frontend received in the api.',
    });
}

export async function onDisconnect(socket: INYGooseSocket) {
    console.log(`User disconnected with socket id: ${socket.id}`);
}