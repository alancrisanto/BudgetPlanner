import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();
	const { signup, errors: registerErrors } = useAuth();
	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
	const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

	const onSubmit = async (data) => {
		const { email, password } = data;
		const userData = { email, password };
		try {
			const res = await signup(userData);
			if (res && res.status === 201) {
				navigate("/login");
			}
		} catch (error) {
			console.error("Registration failed:", error);
		}
	};

	return (
		<>
			<Helmet>
				<title>BudgetPlanner | Register</title>
				<meta name="description" content="Create a free BudgetPlanner account and start managing your finances today." />
				<meta name="keywords" content="register, create account, sign up, budget app signup, finance tracking registration" />
				<meta name="author" content="Veihi Joy Tupai,  Cameron Pedro, Rama Krishna Bhagi Perez, Bamutesiza Ronald" />
				<meta property="og:title" content="BudgetPlanner | Register" />
				<meta property="og:description" content="Sign up for BudgetPlanner and take control of your budget." />
				<meta property="og:type" content="website" />
				<meta property="og:url" content="" />
				<meta property="og:image" content="" />
				<meta name="twitter:card" content="" />
				<meta name="twitter:title" content="BudgetPlanner | Register" />
				<meta name="twitter:description" content="Sign up now and start managing your personal finances with ease." />
				<meta name="twitter:image" content="" />
				<link rel="canonical" href="" />
			</Helmet>

			<div className="flex items-center justify-center min-h-screen bg-gray-100">
				<div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
					<h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
					<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
						{registerErrors && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm my-4 shadow-sm">
								{registerErrors}
							</div>
						)}

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

						<div className="relative">
							<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="password">
								Password
							</label>
							<input
								id="password"
								type={showPassword ? "text" : "password"}
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								{...register("password", { required: true })}
								autoComplete="new-password"
							/>
							<span
								className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
								onClick={togglePasswordVisibility}
							>
								{showPassword ? <FaEyeSlash /> : <FaEye />}
							</span>
							{errors.password && <span className="text-red-500 text-xs">Password is required</span>}
						</div>

						<div className="relative">
							<label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="confirmPassword">
								Confirm Password
							</label>
							<input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
								{...register("confirmPassword", {
									required: true,
									validate: (value) =>
										value === watch("password") || "Passwords do not match",
								})}
								autoComplete="new-password"
							/>
							<span
								className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
								onClick={toggleConfirmPasswordVisibility}
							>
								{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
							</span>
							{errors.confirmPassword && (
								<span className="text-red-500 text-xs">
									{errors.confirmPassword.message || "Confirm your password"}
								</span>
							)}
						</div>

						<button
							type="submit"
							className="w-full py-2 mt-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
						>
							Register
						</button>
					</form>

					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<Link className="text-blue-500" to="/login">
							Login here
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}

export default Register;
