import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  exp: number; // Expiry time in seconds since Unix epoch
  role:string
}

const getToken = (authHeader: string): DecodedToken => {
  let token = null;

  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7, authHeader.length);
  } else {
    // Throw an error or handle the error as needed
    throw new Error('Authorization header is not formatted correctly');
  }

  // Decode the JWT token to extract userId and exp
  const decodedToken = jwt.decode(token) as DecodedToken;

  if (!decodedToken) {
    throw new Error('Failed to decode token');
  }

  return decodedToken;
};

export default getToken;
