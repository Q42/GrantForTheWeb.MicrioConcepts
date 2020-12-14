<script>
  const SERVER_ADDRESS = 'http://localhost:5100';

  export let paymentPointer;

  let isOpen = false;
  let hasPaid = false;
  let showMessage = true;
  let accountName = '';
  let authToken = '';

  async function onPay() {
    console.log(accountName, authToken, paymentPointer);
    if (!authToken || !accountName) {
      isOpen = true;
      return;
    }

    await pay();
  }

  async function pay() {
    fetch(`${SERVER_ADDRESS}/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': SERVER_ADDRESS,
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify({
        amount: 1,
        accountName,
        authToken,
        paymentPointer,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.successfulPayment === true) {
          hasPaid = true;
        } else {
          console.log('Payment failed.');
        }
      });
  }
</script>

<style type="text/scss">
  .notification {
    position: absolute;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);

    strong {
      text-decoration: underline;
      &:hover {
        cursor: pointer;
      }
    }
  }
  aside {
    position: absolute;
    right: 0;
    top: 25px;
  }

  .form {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    margin-right: 25px;
    border-radius: 5px;
    border-top-left-radius: 0;
    transform: translateX(calc(100% + 25px));
    transition: transform 0.5s ease;
    z-index: 1;
    padding-right: 20px;

    .handle {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
      z-index: 0;
      display: block;
      height: 44px;
      width: 44px;
      position: absolute;
      left: 1px;
      top: 0;
      transform: translateX(-100%);
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      background-color: white;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24" viewBox="0 0 24 24"><path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/></svg>');

      &:hover {
        cursor: pointer;
      }
    }

    .form-fields {
      position: relative;
      background: white;
      padding: 25px;
      z-index: 1;
    }

    &.open {
      transform: translateX(0);
    }
  }
</style>

{#if showMessage && !hasPaid}
  <div class="notification is-success">
    <button class="delete" on:click={() => (showMessage = false)} />
    Like this content?
    <strong on:click={onPay}>Support the creator!</strong>
  </div>
{/if}
{#if hasPaid}
  <div class="notification is-success">
    <button class="delete" on:click={() => (showMessage = false)} />
    Awesome! Thank you for donating.
  </div>
{/if}
<aside>
  <div class="form" class:open={isOpen}>
    <span on:click={() => (isOpen = !isOpen)} class="handle" />
    <div class="form-fields">
      <div class="field">
        <label class="label" for="account-name">Ripple account</label>
        <div class="control">
          <input
            class="input"
            type="text"
            id="account-name"
            bind:value={accountName} />
        </div>
      </div>

      <div class="field">
        <label class="label" for="auth-token">Ripple account token</label>
        <div class="control">
          <input
            class="input"
            type="text"
            id="auth-token"
            bind:value={authToken} />
        </div>
      </div>

      <div class="field has-addons">
        <button class="button is-primary" on:click={onPay}> Donate </button>
      </div>
    </div>
  </div>
</aside>
