export function extractRequest (req: any): { data: any, ack?: Function } {
  if (Array.isArray(req)) {
    const [data, ack] = req
    return { data, ack }
  } else {
    return { data: req }
  }
}
