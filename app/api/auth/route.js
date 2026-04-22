import { loginUser, registerUser } from "../../../server/controllers/authController";

export async function POST(req) {
  const body = await req.json();

  if (body.type === "login") {
    return Response.json(loginUser(body));
  }

  if (body.type === "register") {
    return Response.json(registerUser(body));
  }

  return Response.json({ message: "Invalid request" });
}