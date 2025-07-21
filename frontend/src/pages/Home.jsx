import React from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Aitools from "../components/Aitools"
import Testimonial from "../components/Testemonials"
import Plan from "../components/Plan"
import Footer from "../layouts/Footer"

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Aitools />
      <Testimonial />
      <Plan />
      <Footer />
    </>
  )
}

export default Home
