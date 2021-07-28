<template lang="pug">
  div
    a.share-btn(
      rel="noopener noreferrer"
      target="_blank"
      href="https://www.facebook.com/sharer/sharer.php?kid_directed_site=0&u=https%3A%2F%2Fcovidtracker-th.netlify.app%2F&display=popup&ref=plugin&src=share_button"
    )
      img(
        alt="Facebook share button"
        width="12"
        height="12"
        src="https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/jydh1rvUVNm.png?_nc_eui2=AeHR3ONTsxSu3gl6Az4lFOoOR1XItfVluIxHVci19WW4jGnj049gDN339SeHSoxhWwk"
      )
      span.text-xs.ml-1 Share
</template>

<style lang="scss" scoped>
.share-btn {
  @apply flex items-center no-underline bg-blue-800;
  height: 20px;
  padding: 1px 8px 1px 6px;
  // background-color: #1877f2;
  color: #fff;
  border-radius: 3px;
  font-weight: 500;
  cursor: pointer;
}
</style>
