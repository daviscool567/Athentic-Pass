import React, { useState, useEffect } from 'react'
import './index.css'
import one from '../../asset/one.jpg'
import logo from '../../asset/logo.png'
import { setHome, getHome } from '../../services/auth'
import two from '../../asset/two.jpg'
import three from '../../asset/three.jpg'
import { Button, Carousel, CarouselIndicators, CarouselItem } from 'reactstrap'
import { NavLink, withRouter } from 'react-router-dom'

function Home(props) {

  useEffect(() => {
    let storage = localStorage.getItem('customer_authentic_pass_home')
    if (storage) {
      props.history.push('/login');
    }
    return () => {
      localStorage.setItem('customer_authentic_pass_home', 'scan');
    }
  }, []);

  const items = [
    {
      src: one,
      altText: 'Slide 1',
      key: '1'
    },
    {
      src: two,
      altText: 'Slide 2',
      key: '2'
    },
    {
      src: three,
      altText: 'Slide 3',
      key: '3'
    }
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [indexState, setIndexState] = useState({ one: "grey", two: "lightgrey", three: "lightgrey" });
  const [animating, setAnimating] = useState(false);
  const [bgStyle, setbgStyle] = useState("#ecf4f7");
  const [imgText, setImgText] = useState("Authentic a product easily");

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
    if (newIndex === 0) {
      setbgStyle("#ecf4f7");
      setImgText("Authentic a product easily");
      setIndexState({ one: "grey", two: "lightgrey", three: "lightgrey" })
    } else if (newIndex === 1) {
      setbgStyle('#f0edfe');
      setImgText("Guaranteed quality check");
      setIndexState({ one: "lightgrey", two: "grey", three: "lightgrey" })
    } else {
      setbgStyle("#c2e6f2");
      setImgText("Ensure safety product");
      setIndexState({ one: "lighgrey", two: "lightgrey", three: "grey" })
    }
  }

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} />
      </CarouselItem>
    );
  });

  const indexer = (e) => {
    goToIndex(e)
  }

  return (
    <div className="homePage" style={{ background: activeIndex === 0 ? "#ecf4f7" : activeIndex === 1 ? "#f0edfe" : "#c2e6f2" }}>
      <div className="firstOne">
        <img className="authPassImg" src={logo} />
        <h3>Authetic <span style={{ color: "#47aafd" }}>Pass</span></h3>
      </div>
      <div className="slides" >
        <Carousel className="carosel"
          activeIndex={activeIndex}
          next={next}
          previous={previous} interval={1000000}>
          <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
          {slides}
          <div className="secControl">
            <span id="one" style={{ background: activeIndex === 0 ? "grey" : "lightgrey" }} onClick={() => indexer(0)}></span>
            <span id="two" style={{ background: activeIndex === 1 ? "grey" : "lightgrey" }} onClick={() => indexer(1)}></span>
            <span id="three" style={{ background: activeIndex === 2 ? "grey" : "lightgrey" }} onClick={() => indexer(2)}></span> </div>
        </Carousel>
        <h5>{activeIndex === 0 ? "Authenticate a product easily" : activeIndex === 1 ? "Guaranteed quality check" : "Ensure safety product"}</h5>
        <NavLink to="/register" ><Button color="success">Join Now</Button></NavLink>
        <NavLink to="/login"> <Button outline  > Sign in</Button> </NavLink>
      </div>
    </div>
  )
}

export default withRouter(Home)
