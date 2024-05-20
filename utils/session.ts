import { UserSession } from "@/types/userSession";
function saveUserSession(session: UserSession): void {
  sessionStorage.setItem("userSession", JSON.stringify(session));
}

function getUserSession(): UserSession | null {
  const sessionStr = sessionStorage.getItem("userSession");
  if (sessionStr) {
    try {
      return JSON.parse(sessionStr) as UserSession;
    } catch (error) {
      console.error("Error parsing user session from sessionStorage:", error);
      return null;
    }
  }
  return null;
}

module.exports = {
  saveUserSession,
  getUserSession,
};
