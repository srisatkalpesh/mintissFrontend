import axios from "@/axios";
import toastService from "@/services/toastService";

class GunrateTokenService {
  async getUserTokens() {
    try {
      const response = await axios.get("/user/gunrate/tokens");
      return response.data.data || [];
    } catch (error) {
      console.error("Error fetching user tokens:", error);
      toastService.error("Failed to load tokens");
      throw error;
    }
  }

  async getTokenStats() {
    try {
      const response = await axios.get("/user/gunrate/stats");
      return response.data.data || {};
    } catch (error) {
      console.error("Error fetching token stats:", error);
      toastService.error("Failed to load token statistics");
      throw error;
    }
  }

  async generateToken(tokenData) {
    try {
      const response = await axios.post("/user/gunrate/token", tokenData);
      toastService.success("Token generated successfully!");
      return response.data.data;
    } catch (error) {
      console.error("Error generating token:", error);
      const message = error.response?.data?.message || "Failed to generate token";
      toastService.error(message);
      throw error;
    }
  }

  async verifyToken(tokenCode) {
    try {
      const response = await axios.post("/gunrate/verify", { token_code: tokenCode });
      return response.data.data;
    } catch (error) {
      console.error("Error verifying token:", error);
      const message = error.response?.data?.message || "Failed to verify token";
      toastService.error(message);
      throw error;
    }
  }

  async useToken(tokenCode) {
    try {
      const response = await axios.post("/gunrate/use", { token_code: tokenCode });
      toastService.success("Token redeemed successfully! Mintiss added to your wallet.");
      return response.data.data;
    } catch (error) {
      console.error("Error using token:", error);
      const message = error.response?.data?.message || "Failed to redeem token";
      toastService.error(message);
      throw error;
    }
  }

  updateUserBalance(mintissAdded) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user.mintiss = (parseFloat(user.mintiss || 0) + parseFloat(mintissAdded)).toString();
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    }
    return null;
  }
}

export default new GunrateTokenService(); 