
export const loginUser = (data) => {
  return {
    message: "Login successful ✅",
    user: { email: data.email },
  };
};

export const registerUser = (data) => {
  return {
    message: "User registered ✅",
    user: { email: data.email },
  };
};