<script>
  import Monetization from './Monetization.svelte';

  export let micrioId = '';

  $: paymentPointer = null;
  $: isMonetized = false;

  let micrioInstance = new Micrio({
    id: micrioId,
    container: document.getElementById('micrio'),
    hookEvents: true,
    autoInit: true,
    minimap: false,
    initType: 'cover',
  });

  micrioInstance.addEventListener('load', (e) => {
    paymentPointer = e.detail.custom.wallet_address;
    isMonetized = !!paymentPointer;
  });
</script>

<style>
  #micrio {
    height: 100vh;
    width: 100vw;
  }
</style>

<div id="micrio" />

{#if isMonetized}
  <Monetization {paymentPointer} />
{/if}
