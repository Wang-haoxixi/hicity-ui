import request from "@/router/axios";

export function getTicketList(params) {
  return request({
    url: '/dms/ticketing/get_by_conference',
    params
  })
}

export function addTicket(data) {
  return request({
    url: '/dms/ticketing/create',
    method: 'POST',
    data
  })
}

export function updateTicket(data) {
  return request({
    url: '/dms/ticketing/edit_ticket',
    method: 'POST',
    data
  })
}

export function getTicketDetail(params) {
  return request({
    url: '/dms/ticketing/get',
    params
  })
}

export function deleteTicket(data) {
  return request({
    url: '/dms/ticketing/logic_batch_delete',
    method: 'POST',
    data
  })
}

