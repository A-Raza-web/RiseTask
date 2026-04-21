import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ImageTrail.css";

function lerp(a, b, n) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(event, rect) {
  let clientX = 0;
  let clientY = 0;

  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function getMouseDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

class ImageItem {
  constructor(element) {
    this.DOM = {
      el: element,
      inner: element.querySelector(".image-trail__img-inner"),
    };
    this.defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
    this.rect = null;
    this.resize = null;

    this.getRect();
    this.initEvents();
  }

  initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener("resize", this.resize);
  }

  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }

  destroy() {
    if (this.resize) {
      window.removeEventListener("resize", this.resize);
    }
    gsap.killTweensOf(this.DOM.el);
    if (this.DOM.inner) {
      gsap.killTweensOf(this.DOM.inner);
    }
  }
}

class ImageTrailVariant5 {
  constructor(container, options = {}) {
    this.container = container;
    this.DOM = { el: container };
    this.trackOnWindow = Boolean(options.trackOnWindow);
    this.images = [...container.querySelectorAll(".image-trail__img")].map(
      (img) => new ImageItem(img),
    );
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 80;
    this.lastAngle = 0;
    this.rafId = null;
    this.destroyed = false;
    this.started = false;

    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };

    this.getPointerData = (event) => {
      const rect = container.getBoundingClientRect();
      const pointer = getLocalPointerPos(event, rect);
      const isInside =
        pointer.x >= 0 &&
        pointer.y >= 0 &&
        pointer.x <= rect.width &&
        pointer.y <= rect.height;

      return { pointer, isInside };
    };

    this.handlePointerMove = (event) => {
      const { pointer, isInside } = this.getPointerData(event);
      if (this.trackOnWindow && !isInside) {
        return;
      }

      this.mousePos = pointer;

      if (this.started) {
        return;
      }

      this.started = true;
      this.cacheMousePos = { ...this.mousePos };
      this.lastMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(this.render);
    };

    this.render = () => {
      if (this.destroyed) {
        return;
      }

      const distance = getMouseDistance(this.mousePos, this.lastMousePos);
      if (distance > this.threshold) {
        this.showNextImage();
        this.lastMousePos = { ...this.mousePos };
      }

      this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
      this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);

      if (this.isIdle && this.zIndexVal !== 1) {
        this.zIndexVal = 1;
      }

      this.rafId = requestAnimationFrame(this.render);
    };

    this.eventTarget = this.trackOnWindow ? window : container;
    this.eventTarget.addEventListener("mousemove", this.handlePointerMove);
    this.eventTarget.addEventListener("touchmove", this.handlePointerMove, {
      passive: true,
    });
  }

  showNextImage() {
    if (!this.imagesTotal) {
      return;
    }

    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (angle < 0) {
      angle += 360;
    }
    if (angle > 90 && angle <= 270) {
      angle += 180;
    }

    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;

    const startAngle = isMovingClockwise ? angle - 10 : angle + 10;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }

    dx *= distance / 150;
    dy *= distance / 150;

    this.zIndexVal += 1;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;

    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          filter: "brightness(80%)",
          scale: 0.1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
          rotation: startAngle,
        },
        {
          duration: 1,
          ease: "power2",
          scale: 1,
          filter: "brightness(100%)",
          x: this.mousePos.x - img.rect.width / 2 + dx * 70,
          y: this.mousePos.y - img.rect.height / 2 + dy * 70,
          rotation: this.lastAngle,
        },
        0,
      )
      .to(
        img.DOM.el,
        {
          duration: 0.4,
          ease: "expo",
          opacity: 0,
        },
        0.5,
      )
      .to(
        img.DOM.el,
        {
          duration: 1.5,
          ease: "power4",
          x: `+=${dx * 120}`,
          y: `+=${dy * 120}`,
        },
        0.05,
      );
  }

  onImageActivated() {
    this.activeImagesCount += 1;
    this.isIdle = false;
  }

  onImageDeactivated() {
    this.activeImagesCount -= 1;
    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }

  destroy() {
    this.destroyed = true;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.eventTarget.removeEventListener("mousemove", this.handlePointerMove);
    this.eventTarget.removeEventListener("touchmove", this.handlePointerMove);

    this.images.forEach((image) => image.destroy());
  }
}

const variantMap = {
  5: ImageTrailVariant5,
};

export default function ImageTrail({
  items = [],
  variant = 5,
  className = "",
  trackOnWindow = false,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !items.length) {
      return undefined;
    }

    const normalizedVariant = Number(variant);
    const VariantClass = variantMap[normalizedVariant] || variantMap[5];
    const trail = new VariantClass(containerRef.current, { trackOnWindow });

    return () => {
      trail.destroy();
    };
  }, [variant, items, trackOnWindow]);

  return (
    <div className={`image-trail ${className}`.trim()} ref={containerRef}>
      {items.map((url, index) => (
        <div className="image-trail__img" key={`${url}-${index}`}>
          <div
            className="image-trail__img-inner"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
