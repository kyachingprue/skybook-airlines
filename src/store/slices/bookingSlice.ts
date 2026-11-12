import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Passenger {
  name: string;
  age?: number;
  gender?: string;
  passportNumber?: string;
}

export interface BookingState {
  selectedFlightId: string | null;
  selectedSeats: string[];
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  step: number;
}

const initialState: BookingState = {
  selectedFlightId: null,
  selectedSeats: [],
  passengers: [],
  contactEmail: "",
  contactPhone: "",
  step: 1,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setFlight(state, action: PayloadAction<string>) {
      state.selectedFlightId = action.payload;
      state.selectedSeats = [];
      state.passengers = [];
    },
    toggleSeat(state, action: PayloadAction<string>) {
      const seat = action.payload;
      if (state.selectedSeats.includes(seat)) {
        state.selectedSeats = state.selectedSeats.filter((s) => s !== seat);
      } else {
        state.selectedSeats.push(seat);
      }
    },
    setPassengers(state, action: PayloadAction<Passenger[]>) {
      state.passengers = action.payload;
    },
    setContact(state, action: PayloadAction<{ email: string; phone: string }>) {
      state.contactEmail = action.payload.email;
      state.contactPhone = action.payload.phone;
    },
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    resetBooking() {
      return initialState;
    },
  },
});

export const { setFlight, toggleSeat, setPassengers, setContact, setStep, resetBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
