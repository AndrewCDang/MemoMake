const EmailTemplate = ({
    userName,
    token,
    purpose,
}: {
    userName: string;
    token: string;
    purpose: "verifyEmail" | "resetPassword";
}) => {
    return (
        <div>
            <h4>Hello {userName}</h4>
            {purpose === "verifyEmail" && (
                <a
                    href={`${process.env.WEBSITE_URL}/auth/verify?token=${token}`}
                >
                    Click here to activate your account
                </a>
            )}
            {purpose === "resetPassword" && (
                <a
                    href={`${process.env.WEBSITE_URL}/auth/resetPassword?token=${token}`}
                >
                    Click here to activate your account
                </a>
            )}
        </div>
    );
};

export default EmailTemplate;
