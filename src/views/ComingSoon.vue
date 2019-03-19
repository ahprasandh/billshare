<template>
  <div style="display:flex;justify-content:center;height:100%">
    <h1 class="comingSoon">
      <s class="m20">
        <span>I</span>
        <span>n</span>
        <span>s</span>
        <span>t</span>
        <span>a</span>
        <span>l</span>
        <span>l</span>
        <span>a</span>
        <span>t</span>
        <span>i</span>
        <span>o</span>
        <span>n</span>
      </s>
      <s class="m20">
        <span>i</span>
        <span>n</span>
      </s>
      <s class="m20">
        <span>p</span>
        <span>r</span>
        <span>o</span>
        <span>g</span>
        <span>r</span>
        <span>e</span>
        <span>s</span>
        <span>s</span>
        <span>!</span>
      </s>
    </h1>
  </div>
</template>
<script>
export default {
  name: "ComingSoon"
};
</script>
<style>
.comingSoon {
  align-self: center;
  color: var(--hard);
}

.m20 {
  margin: 0 20px;
}

.comingSoon span {
  position: relative;
  top: 20px;
  display: inline-block;
  animation: bounce 1s ease infinite alternate;
  color: var(--soft);
  text-shadow: 0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc,
    0 5px 0 #ccc, 0 6px 0 transparent, 0 7px 0 transparent, 0 8px 0 transparent,
    0 9px 0 transparent, 0 10px 10px rgba(0, 0, 0, 0.4);
  align-self: center;
  letter-spacing: 1.5vw;
}

.comingSoon span:nth-child(2) {
  animation-delay: 0.1s;
}
.comingSoon span:nth-child(3) {
  animation-delay: 0.2s;
}
.comingSoon span:nth-child(4) {
  animation-delay: 0.3s;
}

.comingSoon span:nth-child(5) {
  animation-delay: 0.4s;
}
.comingSoon span:nth-child(6) {
  animation-delay: 0.5s;
}
.comingSoon span:nth-child(7) {
  animation-delay: 0.6s;
}
.comingSoon span:nth-child(8) {
  animation-delay: 0.7s;
}
.comingSoon span:nth-child(9) {
  animation-delay: 0.8s;
}
.comingSoon span:nth-child(10) {
  animation-delay: 0.9s;
}
.comingSoon span:nth-child(11) {
  animation-delay: 1s;
}
.comingSoon span:nth-child(12) {
  animation-delay: 1.1s;
}
.comingSoon span:nth-child(13) {
  animation-delay: 1.2s;
}
@keyframes bounce {
  100% {
    top: -2px;
    text-shadow: 0 1px 0 #ccc, 0 2px 0 #ccc, 0 3px 0 #ccc, 0 4px 0 #ccc,
      0 5px 0 #ccc, 0 6px 0 #ccc, 0 7px 0 #ccc, 0 8px 0 #ccc, 0 9px 0 #ccc,
      0 50px 25px rgba(0, 0, 0, 0.2);
  }
}
</style>
