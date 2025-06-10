import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
	const storedSuccess = JSON.parse(localStorage.getItem("registrationSuccess"));

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			email: storedSuccess?.email || "",
			password: storedSuccess?.password || ""
		}
	});

	const { signin, isAuthenticated, errors: signinErrors } = useAuth();
	const [successMessage, setSuccessMessage] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated) {
			navigate("/dashboard");
		}

		if (storedSuccess) {
			setSuccessMessage("Account created successfully. You can now log in.");
			localStorage.removeItem("registrationSuccess");
		}
	}, [isAuthenticated]);

	const onSubmit = async (data) => {
		try {
			await signin(data);
			console.log("login isauthenticated:", isAuthenticated);
		} catch (error) {
			console.error("Login failed:", error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
				<h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div>
						{signinErrors && (
							<span className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm my-4 shadow-sm">
								{signinErrors}
							</span>
						)}
						{successMessage && (
							<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-sm my-4 shadow-sm">
								{successMessage}
							</div>
						)}

					</div>
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="email">
							Email or Username
						</label>
						<input
							id="emailOrUsername"
							type="text"
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							{...register("email", { required: true })}
							autoComplete="emailOrUsername"
						/>
						{errors.email && <span className="text-red-500 text-xs">Email is required</span>}
					</div>
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">
							Password
						</label>
						<input
							id="password"
							type="password"
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							{...register("password", { required: true })}
							autoComplete="current-password"
						/>
						{errors.password && <span className="text-red-500 text-xs">Password is required</span>}
						<div className="mt-1 text-right">
							<Link to="/forgot-password" className="text-xs text-blue-500 hover:underline">
								Forgot password?
							</Link>
						</div>
					</div>
					<button
						type="submit"
						className="w-full py-2 mt-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
					>
						Sign In
					</button>
				</form>
				<p className="text-sm text-gray-600">
					Don't have an account? <Link className='text-blue-500' to="/register">Register here</Link>
				</p>
			</div>
		</div>
	);
}

export default Login;
