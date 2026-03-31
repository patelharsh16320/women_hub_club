export default function About() {
	return (
		<section className="about-wrapper">
			<div className="about-container">

				<h1 className="about-title">About Women Hub</h1>

				<div className="about-card">

					{/* Our Story */}
					<section className="about-section">
						<h2>Our Story</h2>
						<p>
							Women Hub was founded in 2024 with a mission to empower women
							by providing a curated selection of fashion, beauty, and
							lifestyle products. Our platform connects women with the
							latest trends, exclusive deals, and a supportive community.
						</p>
					</section>

					{/* What We Offer */}
					<section className="about-section">
						<h2>What We Offer</h2>
						<ul>
							<li>Wide range of women’s clothing, accessories, and beauty products</li>
							<li>Easy and secure online shopping experience</li>
							<li>Fast shipping and hassle-free returns</li>
							<li>Exclusive member discounts and offers</li>
							<li>24/7 customer support</li>
						</ul>
					</section>

					{/* Mission */}
					<section className="about-section">
						<h2>Our Mission</h2>
						<p>
							To inspire confidence and celebrate individuality by making
							quality products accessible to every woman.
						</p>
					</section>

					{/* Team */}
					<section className="about-section">
						<h2>Meet the Team</h2>
						<ul>
							<li>Harsh Patel – Founder & CEO</li>
							<li>Harry Portter – Head of Marketing</li>
							<li>Hermione Granger – Customer Success Lead</li>
							<li>Team of passionate developers, designers, and support staff</li>
						</ul>
					</section>

					{/* Contact */}
					<section className="about-section contact-section">
						<h2>Contact Us</h2>
						<p>Email: support@womenhub.com</p>
						<p>Location: Maliba, Bardoli, India</p>
					</section>

				</div>
			</div>
		</section>
	);
}