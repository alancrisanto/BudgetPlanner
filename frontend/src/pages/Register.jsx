import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Register() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();
	const { signup, errors: registerErrors } = useAuth();
	const navigate = useNavigate();

	const onSubmit = async (data) => {
		const { email, password, username, firstName, lastName } = data;
		const userData = { email, password, username, firstName, lastName };
		try {
			const res = await signup(userData);
			if (res && res.status === 201) {
				localStorage.setItem("registrationSuccess", JSON.stringify({
					email,
					password
				}));
				navigate("/login");
			}


		} catch (error) {
			console.error("Registration failed:", error);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
				<h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<div>
						{registerErrors && (
							<span className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm my-4 shadow-sm">
								{registerErrors}
							</span>
						)}
					</div>
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="firstName">
							First Name
						</label>
						<input {...register("firstName", { required: true })} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							id="firstName" />
					</div>
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="lastName">
							Last Name
						</label>
						<input {...register("lastName", { required: true })} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							id="lastName" />

					</div>
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="username">
							Username
						</label>
						<input {...register("username", { required: true })} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							id="username" />

					</div>
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="email">
							Email
						</label>
						<input
							id="email"
							type="email"
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							{...register("email", { required: true })}
							autoComplete="email"
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
							autoComplete="new-password"
						/>
						{errors.password && <span className="text-red-500 text-xs">Password is required</span>}
					</div>
					<div>
						<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="confirmPassword">
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							type="password"
							className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
							{...register("confirmPassword", {
								required: true,
								validate: (value) => value === watch("password") || "Passwords do not match",
							})}
							autoComplete="new-password"
						/>
						{errors.confirmPassword && (
							<span className="text-red-500 text-xs">{errors.confirmPassword.message || "Confirm your password"}</span>
						)}
					</div>


					<button
						type="submit"
						className="w-full py-2 mt-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
					>
						Register
					</button>
				</form>
				<p className="text-sm text-gray-600">Already have an account? <Link className='text-blue-500' to="/login" >Login here</Link></p>
			</div>
		</div>
	);
}

export default Register;
