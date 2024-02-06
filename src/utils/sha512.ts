import { createHash } from "crypto";

const sha512 = (content: string) => {
  return createHash('sha512').update(content).digest('hex');
}

export default sha512;
