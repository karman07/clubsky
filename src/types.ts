export type Court = {
  _id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  price: number;
  activity: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Booking = {
  _id: string;
  courtId: Court;
  name: string;
  phoneNumber: string;
  timeSlots: number[][];
  date: string;
  paidAmount: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type CreateBookingDto = {
  courtId: string;
  name: string;
  phoneNumber: string;
  timeSlots: number[][] | string;
  date: string;
  paidAmount: number;
};
