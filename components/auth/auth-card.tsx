interface AuthCardProps {
    logo: React.ReactNode;
    children: React.ReactNode;
}

const AuthCard = ({ logo, children }: AuthCardProps) => (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
        <div>{logo}</div>

        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-card shadow-md overflow-hidden sm:rounded-lg border">
            {children}
        </div>
    </div>
);

export default AuthCard;
