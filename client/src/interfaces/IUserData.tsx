export interface IUserData {
  _id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  city?: string;
  aboutMe?: string;
  dateOfBirth?: string;
  gender?: string;
  friends?: any;
  friendRequests?: IFriendRequest[];
  friendRequest?: null | any;
  wall: any[];
}

export interface IPost {
  _id?: string;
  content: string;
  images: string[];
  repost: IPost;
  repostedBy: IUserData[];
  comments: any[];
  likes: IUserData[];
  user: IUserData;
}

export interface IFriendRequest {
  recipient: string;
  requester: string;
  status: "rejected" | "accepted" | "pending";
  _id: string;
}
