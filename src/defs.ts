import { PostCommentResponse } from './adapters/message'

export type IQCallback<T> = (response: T, error?: Error) => void

export type IQProgressListener = (error: Error, progress: ProgressEvent, url: string) => void

export interface IQiscus {
  init(appId: string, syncInterval: number): void
  initWithCustomServer(appId: string, baseUrl: string, brokerUrl: string, brokerLbUrl: string, syncInterval: number): void

  // from UserAdapter -------------------------------
  setUser(userId: string, userKey: string, username: string, avatarUrl: string, extras: object, callback: IQCallback<IQUser>): void | Promise<IQUser>
  setUserWithIdentityToken(token: string, callback?: IQCallback<IQUser>): void | Promise<IQUser>
  blockUser(userId: string, callback?: IQCallback<IQUser>): void | Promise<IQUser>
  unblockUser(userId: string, callback?: IQCallback<IQUser>): void | Promise<IQUser>
  getBlockedUserList(page?: number, limit?: number, callback?: IQCallback<IQUser[]>): void | Promise<IQUser[]>
  getUserData(callback?: IQCallback<IQUser>): void | Promise<IQUser>
  updateUser(username?: string, avatarUrl?: string, extras?: object, callback?: IQCallback<IQUser>): void | Promise<IQUser>
  getUserList(searchUsername?: string, page?: number, limit?: number, callback?: IQCallback<IQUser[]>): void | Promise<IQUser[]>

  // ------------------------------------------------

  // TODO: I'm not discussed yet
  clearUser(callback?: IQCallback<void>): void

  // from RoomAdapter ----------
  chatUser(userId: string, avatarUrl: string, extras: object, callback?: IQCallback<IQRoom>): void | Promise<IQRoom>
  createGroupChat(name: string, userIds: string[], avatarUrl: string, extras: object, callback?: IQCallback<IQRoom>): void | Promise<IQRoom>
  createChannel(uniqueId: string, name: string, avatarUrl: string, extras: object, callback?: IQCallback<IQRoom>): void | Promise<IQRoom>
  updateChatRoom(roomId: number, name: string, avatarUrl: string, extras: object, callback?: IQCallback<IQRoom>): void | Promise<IQRoom>
  addParticipants(roomId: number, userIds: string[], callback?: IQCallback<IQParticipant[]>): void | Promise<IQParticipant[]>
  removeParticipants(roomId: number, userIds: string[], callback?: IQCallback<IQParticipant[]>): void | Promise<IQParticipant[]>
  getChatRoomWithMessages(roomId: number, callback?: IQCallback<IQRoom>): void | Promise<IQRoom>
  getChatRoom(roomId: number, uniqueId: number, page?: number, showRemoved?: boolean, showParticipant?: boolean, callback?: IQCallback<IQRoom>): void | Promise<IQRoom>
  getChatRooms(showParticipant?: boolean, showRemoved?: boolean, showEmpty?: boolean, page?: number, limit?: number, callback?: IQCallback<IQRoom[]>): void | Promise<IQRoom[]>
  getParticipantList(roomId: number, offset?: number, sorting?: 'asc' | 'desc' | null, callback?: IQCallback<IQParticipant[]>): void
  // ---------------------------

  // from MessageAdapter -----------------------------------
  sendMessage(roomId: number, message: IQMessageT, callback?: IQCallback<IQMessage>): void | Promise<IQMessage>
  markAsRead(roomId: number, messageId: number, callback?: IQCallback<IQMessage>): void | Promise<IQMessage>
  markAsDelivered(roomId: number, messageId: number, callback?: IQCallback<IQMessage>): void | Promise<IQMessage>
  getPreviouseMessagesById(roomId: number, limit?: number, messageId?: number, callback?: IQCallback<IQMessage[]>): void | Promise<IQMessage[]>
  getNextMessagesById(roomId: number, limit?: number, messageId?: number, callback?: IQCallback<IQMessage[]>): void | Promise<IQMessage[]>
  deleteMessages(messageUniqueIds: string[], callback?: IQCallback<IQMessage[]>): void | Promise<IQMessage[]>
  clearMessagesByChatRoomId(roomIds: number[], callback?: IQCallback<IQRoom[]>): void | Promise<IQRoom[]>
  // -------------------------------------------------------

  // Misc -------------------------------------
  upload(file: File, callback?: IQProgressListener): void
  registerDeviceToken(token: string, callback?: IQCallback<boolean>): void | Promise<boolean>
  removeDeviceToken(token: string, callback?: IQCallback<boolean>): void | Promise<boolean>
  getJWTNonce(callback?: IQCallback<string>): void | Promise<string>
  synchronize(lastMessageId: number): void
  syncrhronizeEvent(lastEventId: number): void
  getTotalUnreadCount(callback?: IQCallback<number>): void | Promise<number>

  // ------------------------------------------
  setTyping(isTyping?: boolean): void

  // from CustomEventAdapter
  publishEvent(eventId: string, data: any): void
  subscribeEvent(eventId: string, callback: IQCallback<any>): void
  unsubscribeEvent(eventId): void
}

export interface IQUserExtraProps {
  avatarUrl?: string
  name?: string
  extras?: string
}

export interface IQUserAdapter {
  login (userId: string, userKey: string, extra: IQUserExtraProps): Promise<IQUser>
  clear (): void
  updateUser (name: string, avatarUrl: string, extras: string): Promise<IQUser>
  getNonce (): Promise<QNonce>
  setUserFromIdentityToken (token: string): Promise<IQUser>
  getUserList (query: string, page?: number, limit?: number): Promise<IQUser[]>
  getBlockedUser (page?: number, limit?: number): Promise<IQUser[]>
  blockUser (userId: string): Promise<IQUser>
  unblockUser (userId: string): Promise<IQUser>
  getUserData(): Promise<IQUser>
  registerDeviceToken(token: string): Promise<boolean>
  unregisterDeviceToken(token: string): Promise<boolean>

  readonly token: string | null
  readonly currentUser: IQUser | null
  readonly currentUserId: string | null
}

export interface IQUser {
  id: number
  userId: string
  displayName: string
  avatarUrl?: string | null
}

export type QNonce = { expired: number, nonce: string }

export enum IQRoomType {
  Group = 'group',
  Single = 'single'
}

export interface IQRoom {
  id: number
  name: string
  avatarUrl: string;
  isChannel: boolean;
  lastMessageId?: number;
  lastMessageContent?: string;
  uniqueId: string;
  unreadCount: number;
  type: IQRoomType;
  totalParticipants?: number;
  participants?: IQParticipant[]
  options?: string
}

export interface IQParticipant extends IQUser {
  lastReadMessageId: number
  lastReceivedMessageId: number
}

export interface IQRoomAdapter {
  chatUser (userId: string, avatarUrl: any, extras: any): Promise<IQRoom>
  getRoomList (showParticipant?: boolean, showRemoved?: boolean, showEmpty?: boolean, page?: number, limit?: number): Promise<IQRoom[]>
  getRoom (roomId: number): Promise<IQRoom>
  getChannel (uniqueId: string, name: string, avatarUrl?: string, extras?: string): Promise<IQRoom>
  updateRoom (roomId: number, name?: string | null, avatarUrl?: string | null, extras?: string | null): Promise<IQRoom>
  getParticipantList (roomId: number, offset?: number | null, sorting?: 'asc' | 'desc' | null): Promise<IQParticipant[]>
  createGroup (name: string, userIds: string[], avatarUrl?: string, extras?: string): Promise<IQRoom>
  removeParticipants (roomId: string, participantIds: string[]): Promise<string[]>

  addParticipants (roomId: number, participantIds: string[]): Promise<IQParticipant[]>

  getRoomInfo (roomId: number, uniqueId: number, page?: number, showRemoved?: boolean, showParticipant?: boolean): Promise<IQRoom>
  clearRoom (roomUniqueIds: number[]): Promise<IQRoom[]>
  getUnreadCount (): Promise<number>
  readonly rooms: Map<number, IQRoom>
}

export type IQMessageT = {
  payload: object,
  extras: object,
  type: string,
  message: string
}
export enum IQMessageStatus {
  Sending,
  Sent,
  Delivered,
  Read,
  Failed
}

export enum IQMessageType {
  Text = 'text',
  Custom = 'custom'
}

export interface IQMessage {
  id: number
  uniqueId: string
  roomId: number
  userId: string
  content: string
  previousMessageId: number
  extras: object
  timestamp: Date
  type: IQMessageType
  status: IQMessageStatus

  updateFromJson(json: PostCommentResponse.Comment): IQMessage
}

export interface IQMessageAdapter {
  readonly messages: Map<string, IQMessage>
  sendMessage (roomId: number, message: IQMessageT): Promise<IQMessage>
  getMessages (roomId: number, lastMessageId?: number, limit?: number, after?: boolean): Promise<IQMessage[]>
  deleteMessage (messageIds: number[]): Promise<IQMessage[]>
  markAsRead (roomId: number, messageId: number): Promise<IQMessage>
  markAsDelivered (roomId: number, messageId: number): Promise<IQMessage>
}
