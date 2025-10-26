import { createFileRoute } from "@tanstack/react-router";
import { Star01, Star02 } from "@untitledui/icons";
import { NavList } from "@/components/application/app-navigation/base-components/nav-list";
import { NavAccountCard } from "@/components/application/app-navigation/base-components/nav-account-card";
import { format } from "date-fns";
import {
	getGetCurrentMemberTransactionsSuspenseQueryOptions,
	useGetCurrentMemberTransactionsSuspense,
} from "@/lib/api/members/members";
import type { Transaction } from "@/lib/api/models";

export const Route = createFileRoute("/members/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(
			getGetCurrentMemberTransactionsSuspenseQueryOptions(),
		);
	},
});

function RouteComponent() {
	// TODO: Replace with real API call when endpoint is implemented
	const dashboardData = {
		membershipStatus: "active",
		membershipEndsAt: new Date(
			Date.now() + 18 * 24 * 60 * 60 * 1000,
		).toISOString(), // 18 days from now
	};

	const { data: transactionsData } = useGetCurrentMemberTransactionsSuspense({
		query: { select: ({ data }) => data },
	});

	// Calculate membership days
	const membershipEndsAt = dashboardData?.membershipEndsAt
		? new Date(dashboardData.membershipEndsAt)
		: null;
	const today = new Date();
	const daysRemaining = membershipEndsAt
		? Math.ceil(
				(membershipEndsAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
			)
		: 0;
	const hoursRemaining = membershipEndsAt
		? Math.ceil(
				(membershipEndsAt.getTime() - today.getTime()) / (1000 * 60 * 60),
			) % 24
		: 0;
	const minutesRemaining = membershipEndsAt
		? Math.ceil((membershipEndsAt.getTime() - today.getTime()) / (1000 * 60)) %
			60
		: 0;

	// Calculate money saved (sum of paid amounts from completed transactions)
	const moneySaved =
		transactionsData?.reduce((sum, transaction) => {
			return sum + (transaction.paid_amount || 0);
		}, 0) || 0;

	// Get status badge color
	const getStatusColor = (status: Transaction["status"]) => {
		switch (status) {
			case "ENTRY":
				return "text-blue-600 bg-blue-100";
			case "EXIT":
				return "text-green-600 bg-green-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	// Format status text
	const getStatusText = (status: Transaction["status"]) => {
		switch (status) {
			case "ENTRY":
				return "Entry";
			case "EXIT":
				return "Exit";
			default:
				return status;
		}
	};

	// Mock data for chart - in production, this would come from API
	const chartData = [
		{ month: "Jan", value: 30 },
		{ month: "Feb", value: 25 },
		{ month: "Mar", value: 20 },
		{ month: "Apr", value: 28 },
		{ month: "May", value: 22 },
		{ month: "Jun", value: 30 },
	];
	const maxValue = Math.max(...chartData.map((d) => d.value));

	const navItems = [
		{ label: "Overview", href: "/members", icon: Star01 },
		{ label: "Membership", href: "/members/membership", icon: Star02 },
		{ label: "Riwayat Transaksi", href: "/members/transactions", icon: Star02 },
	];

	return (
		<div className="flex flex-col min-h-screen bg-gray-900 text-white">
			{/* Sidebar (using shared app-navigation components) */}
			<aside className="fixed left-0 top-0 h-screen w-40 bg-gray-950 p-4 flex flex-col">
				<div className="flex items-center gap-2 mb-2">
					<div className="w-8 h-8 rounded-full bg-brand-500" />
					<span className="font-bold text-lg">Bima Turangga</span>
				</div>

				{/* Primary nav list */}
				<NavList activeUrl="/members" items={navItems} className="flex-1" />

				{/* Bottom account card */}
				<div className="mt-auto">
					<NavAccountCard />
					<p className="text-xs text-gray-500 px-3 mt-2">Membership Area</p>
				</div>
			</aside>

			{/* Main Content */}
			<main className="ml-40 p-8">
				{/* Header */}
				<div className="flex justify-between items-center mb-8">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<Star02 className="size-4 bg-brand-solid" />
							<span className="text-xs text-secondary">
								Dashboards / Overview
							</span>
						</div>
						<h1 className="text-2xl font-bold">Overview</h1>
					</div>
					<div className="flex items-center gap-4">
						<div className="relative">
							<input
								type="text"
								placeholder="Search"
								className="bg-secondary border border-gray-700 rounded-lg px-4 py-2 pl-10 text-sm"
							/>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-4 h-4 absolute left-3 top-3 text-secondary"
								aria-hidden="true"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
						</div>
						<button
							type="button"
							className="p-2 bg-secondary rounded-lg relative"
							aria-label="Notifications"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-5 h-5"
								aria-hidden="true"
							>
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
								<path d="M13.73 21a2 2 0 0 1-3.46 0" />
							</svg>
							<span className="absolute top-1 right-1 w-2 h-2 bg-brand-500 rounded-full" />
						</button>
					</div>
				</div>

				{/* Summary Cards */}
				<div className="grid grid-cols-2 gap-6 mb-8">
					{/* Membership Duration Card */}
					<div className="bg-secondary rounded-xl p-6 border border-gray-700">
						<h3 className="text-sm text-secondary mb-4">
							Tenggang Waktu Membership
						</h3>
						<div className="flex items-baseline gap-2 mb-1">
							<span className="text-4xl font-bold text-green-400">
								{daysRemaining}
							</span>
							<span className="text-xl text-secondary">Hari</span>
							<span className="text-4xl font-bold text-green-400">
								{hoursRemaining}
							</span>
							<span className="text-xl text-secondary">Jam</span>
							<span className="text-4xl font-bold text-green-400">
								{minutesRemaining}
							</span>
							<span className="text-xl text-secondary">Menit</span>
							<span className="text-4xl font-bold text-green-400">20</span>
							<span className="text-xl text-secondary">Detik</span>
						</div>
						<div className="relative mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
							<div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 w-4/5 rounded-full" />
						</div>
						<p className="text-xs text-gray-500 mt-2">80%</p>
					</div>

					{/* Money Earned Card */}
					<div className="bg-secondary rounded-xl p-6 border border-gray-700">
						<h3 className="text-sm text-secondary mb-4">
							Uang yang Anda Hemat
						</h3>
						<div className="flex items-baseline gap-2">
							<span className="text-lg text-secondary">Rp</span>
							<span className="text-4xl font-bold text-green-400">
								{moneySaved.toLocaleString("id-ID")}
							</span>
						</div>
						<div className="flex items-center gap-2 mt-4 text-green-400 text-sm">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-4 h-4"
								aria-hidden="true"
							>
								<path d="m18 15-6-6-6 6" />
							</svg>
							<span>+15.03%</span>
						</div>
					</div>
				</div>

				{/* Chart Section */}
				<div className="bg-secondary rounded-xl p-6 border border-gray-700 mb-8">
					<h3 className="text-lg font-semibold mb-6">
						Perbandingan Waktu Lama Parkir
					</h3>
					<div className="flex items-end justify-between h-48 gap-4">
						{chartData.map((item) => (
							<div
								key={item.month}
								className="flex flex-col items-center gap-2 flex-1"
							>
								<div className="w-full flex flex-col justify-end items-center h-full">
									<span className="text-xs text-secondary mb-2">
										{item.value}M
									</span>
									<div
										className="w-full bg-gradient-to-t from-green-400 to-green-500 rounded-t-lg"
										style={{
											height: `${(item.value / maxValue) * 100}%`,
										}}
									/>
								</div>
								<span className="text-xs text-secondary">{item.month}</span>
							</div>
						))}
					</div>
				</div>

				{/* Transactions Table */}
				<div className="bg-secondary rounded-xl border border-gray-700 overflow-hidden">
					<div className="flex items-center justify-between p-6 border-b border-gray-700">
						<h3 className="text-lg font-semibold">Riwayat Transaksi</h3>
						<div className="flex gap-2">
							<button
								type="button"
								className="p-2 hover:bg-gray-700 rounded"
								aria-label="Add"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="w-4 h-4"
									aria-hidden="true"
								>
									<path d="M12 5v14M5 12h14" />
								</svg>
							</button>
							<button
								type="button"
								className="p-2 hover:bg-gray-700 rounded"
								aria-label="Filter"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="w-4 h-4"
									aria-hidden="true"
								>
									<line x1="4" y1="21" x2="4" y2="14" />
									<line x1="4" y1="10" x2="4" y2="3" />
									<line x1="12" y1="21" x2="12" y2="12" />
									<line x1="12" y1="8" x2="12" y2="3" />
									<line x1="20" y1="21" x2="20" y2="16" />
									<line x1="20" y1="12" x2="20" y2="3" />
								</svg>
							</button>
							<button
								type="button"
								className="p-2 hover:bg-gray-700 rounded"
								aria-label="Sort"
							>
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									className="w-4 h-4"
									aria-hidden="true"
								>
									<path d="M3 6h18M7 12h10M10 18h4" />
								</svg>
							</button>
						</div>
					</div>

					<div className="relative">
						<div className="absolute left-6 top-3">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-4 h-4 text-secondary"
								aria-hidden="true"
							>
								<circle cx="11" cy="11" r="8" />
								<path d="m21 21-4.35-4.35" />
							</svg>
						</div>
						<input
							type="text"
							placeholder="Search"
							className="w-full bg-gray-900 border-b border-gray-700 px-6 pl-12 py-3 text-sm"
						/>
					</div>

					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-700 text-left">
								<th className="px-6 py-4 text-xs font-medium text-secondary">
									Parkir ID
								</th>
								<th className="px-6 py-4 text-xs font-medium text-secondary">
									Address
								</th>
								<th className="px-6 py-4 text-xs font-medium text-secondary">
									Date
								</th>
								<th className="px-6 py-4 text-xs font-medium text-secondary">
									Status
								</th>
							</tr>
						</thead>
						<tbody>
							{transactionsData?.slice(0, 10).map((transaction) => (
								<tr
									key={transaction.id}
									className="border-b border-gray-700 hover:bg-gray-750"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<input
												type="checkbox"
												className="w-4 h-4 rounded border-gray-600"
												aria-label={`Select transaction ${transaction.access_code}`}
											/>
											<span className="text-sm">
												#{transaction.access_code}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 text-sm">
										{transaction.parkingLevel?.name || "Unknown"}
									</td>
									<td className="px-6 py-4 text-sm">
										<div className="flex items-center gap-2">
											<svg
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												className="w-4 h-4 text-secondary"
												aria-hidden="true"
											>
												<rect
													x="3"
													y="4"
													width="18"
													height="18"
													rx="2"
													ry="2"
												/>
												<line x1="16" y1="2" x2="16" y2="6" />
												<line x1="8" y1="2" x2="8" y2="6" />
												<line x1="3" y1="10" x2="21" y2="10" />
											</svg>
											<span>
												{transaction.created_at
													? format(
															new Date(transaction.created_at),
															"MMM d, yyyy",
														)
													: "N/A"}
											</span>
										</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
										>
											<span className="w-1.5 h-1.5 rounded-full bg-current" />
											{getStatusText(transaction.status)}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
						<button
							type="button"
							className="flex items-center gap-2 text-sm text-secondary hover:text-white"
						>
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-4 h-4"
								aria-hidden="true"
							>
								<path d="m15 18-6-6 6-6" />
							</svg>
							Previous
						</button>
						<div className="flex items-center gap-2">
							<button
								type="button"
								className="px-3 py-1 bg-gray-700 rounded text-sm"
							>
								1
							</button>
							<button
								type="button"
								className="px-3 py-1 hover:bg-gray-700 rounded text-sm"
							>
								2
							</button>
							<button
								type="button"
								className="px-3 py-1 hover:bg-gray-700 rounded text-sm"
							>
								3
							</button>
							<span className="px-2 text-secondary">...</span>
							<button
								type="button"
								className="px-3 py-1 hover:bg-gray-700 rounded text-sm"
							>
								8
							</button>
							<button
								type="button"
								className="px-3 py-1 hover:bg-gray-700 rounded text-sm"
							>
								9
							</button>
							<button
								type="button"
								className="px-3 py-1 hover:bg-gray-700 rounded text-sm"
							>
								10
							</button>
						</div>
						<button
							type="button"
							className="flex items-center gap-2 text-sm text-secondary hover:text-white"
						>
							Next
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								className="w-4 h-4"
								aria-hidden="true"
							>
								<path d="m9 18 6-6-6-6" />
							</svg>
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
