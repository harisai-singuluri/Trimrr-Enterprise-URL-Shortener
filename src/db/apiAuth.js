import {apiClient} from "./apiClient";

export async function login({email, password}) {
  const data = await apiClient("/auth/login", {
    method: "POST",
    body: {email, password},
  });

  if (data && data.token) {
    localStorage.setItem("token", data.token);
    const userWithMetadata = {
      ...data.user,
      role: "authenticated",
      user_metadata: {
        name: data.user.name,
        profile_pic: data.user.profilePic,
      }
    };
    localStorage.setItem("user", JSON.stringify(userWithMetadata));
    return userWithMetadata;
  }
  
  throw new Error("Invalid credentials");
}

export async function signup({name, email, password, profile_pic}) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  if (profile_pic) {
    formData.append("profilePic", profile_pic);
  }

  const user = await apiClient("/auth/register", {
    method: "POST",
    body: formData,
  });

  if (user) {
    return await login({email, password});
  }

  throw new Error("Registration failed");
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const user = await apiClient("/auth/me", {
      method: "GET",
    });
    const userWithMetadata = {
      ...user,
      role: "authenticated",
      user_metadata: {
        name: user.name,
        profile_pic: user.profilePic,
      }
    };
    localStorage.setItem("user", JSON.stringify(userWithMetadata));
    return userWithMetadata;
  } catch (error) {
    console.error("Token verification failed, logging out:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
