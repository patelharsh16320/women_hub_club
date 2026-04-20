"use client";
import { useEffect, useState } from "react";
import { fetchAPI } from "../../services/api";

export default function Shop() {
	const [parents, setParents] = useState([]);
	const [childrenMap, setChildrenMap] = useState({});
	const [expanded, setExpanded] = useState(null);

	useEffect(() => {
		const load = async () => {
			try {
				const data = await fetchAPI("/categories");
				// top-level categories (parent null)
				const top = Array.isArray(data) ? data.filter((c) => !c.parent) : [];
				setParents(top);
			} catch (e) {
				setParents([]);
			}
		};
		load();
	}, []);

	const toggle = async (id) => {
		if (expanded === id) return setExpanded(null);
		// if we already have children cached, just expand
		if (childrenMap[id]) {
			setExpanded(id);
			return;
		}
		// fetch children dynamically
		try {
			const children = await fetchAPI(`/categories?parent=${id}`);
			setChildrenMap((m) => ({ ...m, [id]: children }));
			setExpanded(id);
		} catch (e) {
			setChildrenMap((m) => ({ ...m, [id]: [] }));
			setExpanded(id);
		}
	};

	return (
		<section>
			<div className="max-w-7xl mx-auto p-6">
				<h1 className="text-2xl font-bold mb-4">Shop Products</h1>
				<div className="row">
					<aside className="col-md-3">
						<div className="card p-3">
							<h5>Categories</h5>
							<ul className="list-unstyled">
								{parents.map((p) => (
									<li key={p._id} className="mb-2">
										<button className="btn btn-link p-0" onClick={() => toggle(p._id)}>
											{p.name}
										</button>
										{expanded === p._id && (
											<ul className="ms-3 mt-2">
												{(childrenMap[p._id] || []).length === 0 ? (
													<li className="text-muted">No subcategories</li>
												) : (
													(childrenMap[p._id] || []).map((c) => (
														<li key={c._id}>{c.name}</li>
													))
												)}
											</ul>
										)}
									</li>
								))}
							</ul>
						</div>
					</aside>

					<main className="col-md-9">
						{/* Existing product list component can be placed here. Leaving placeholder for now. */}
						<div className="card p-4">
							<p className="mb-0">Product listing goes here (unchanged). Clicking a parent category loads its subcategories above.</p>
						</div>
					</main>
				</div>
			</div>
		</section>
	);
}
