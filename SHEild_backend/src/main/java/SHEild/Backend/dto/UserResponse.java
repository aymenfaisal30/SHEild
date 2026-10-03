package SHEild.Backend.dto;

public class UserResponse {

    private Long userId;
    private String email;
    private String phone;
    private String accountStatus;
    private Boolean emailVerified;
    private Boolean phoneVerified;

    public UserResponse() {
    }

    public UserResponse(
            Long userId,
            String email,
            String phone,
            String accountStatus,
            Boolean emailVerified,
            Boolean phoneVerified) {

        this.userId = userId;
        this.email = email;
        this.phone = phone;
        this.accountStatus = accountStatus;
        this.emailVerified = emailVerified;
        this.phoneVerified = phoneVerified;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Boolean getPhoneVerified() {
        return phoneVerified;
    }

    public void setPhoneVerified(Boolean phoneVerified) {
        this.phoneVerified = phoneVerified;
    }
} //theres no passwordhash so The password hash stays inside the backend/database hidden.