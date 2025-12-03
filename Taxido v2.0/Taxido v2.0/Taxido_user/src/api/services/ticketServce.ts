import { department, priority, ticket, message } from "../endpoints/ticketEndpoint";
import { ticketDataInterface } from "../interface/ticketInterface";
import { GET_API, POST_API } from "../methods";

export const ticketDataGet = async () => {
  return GET_API(ticket)
    .then((res) => {

      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

export const departmentDataGet = async () => {
  return GET_API(department)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

export const priorityDataGet = async () => {
  return GET_API(priority)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};


export const addTicket = async (data: ticketDataInterface) => {
  return POST_API(data, ticket)
    .then((res) => {
      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};

export const messageDataGet = async (ticket_id: number) => {
  const ticketWithParams = `${message}/${ticket_id}`;

  return GET_API(ticketWithParams)
    .then((res) => {

      return res;
    })
    .catch((e) => {
      return e?.response;
    });
};


const ticketService = {
  ticketDataGet,
  departmentDataGet,
  priorityDataGet,
  addTicket,
  messageDataGet,
};
export default ticketService;
