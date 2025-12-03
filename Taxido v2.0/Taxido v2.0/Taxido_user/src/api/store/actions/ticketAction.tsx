import { Ticket, PRIORITY, DEPARTMENT, TICKET_POST, TICKET_MESSAGE } from "../types/index";
import { ticketService } from "../../services/index";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TicketInterface } from "@src/api/interface/ticketInterface";

export const departmentDataGet = createAsyncThunk(DEPARTMENT, async () => {
  const response = await ticketService.departmentDataGet();
  return response?.data;
});


export const priorityDataGet = createAsyncThunk(PRIORITY, async () => {
  const response = await ticketService.priorityDataGet();
  return response?.data;
});


export const ticketDataGet = createAsyncThunk(Ticket, async () => {
  const response = await ticketService.ticketDataGet();

  return {
    data: response?.data,
    status: response?.status,
  }
});


export const messageDataGet = createAsyncThunk(TICKET_MESSAGE, async ({ ticket_id }: { ticket_id: number }) => {
  const response = await ticketService.messageDataGet(ticket_id);
  return {
    data: response?.data,
    status: response?.status,
  }
});

export const addTicket = createAsyncThunk(
  TICKET_POST,
  async (data: TicketInterface) => {
    const response = await ticketService.addTicket(data);
    return response?.data;
  },
);