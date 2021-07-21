<h1 align="center">
  Eventra <br>
    <a href="https://discord.gg/dTGJ5Bchnq">
    <img src="https://img.shields.io/discord/844279877503025182?label=Discord&logo=discord&logoColor=white&style=for-the-badge" />
  </a>
  <a href="https://www.npmjs.com/package/@duxcore/eventra">
    <img src="https://img.shields.io/npm/dw/@duxcore/eventra?logo=npm&style=for-the-badge" />
    <img src="https://img.shields.io/npm/v/@duxcore/eventra/latest?label=Latest%20Version&style=for-the-badge" />
  </a>
</h1>

Eventra is a lightweight, but powerful JavaScript/TypeScript event manager that comes with built in Type Support and browser/node.js compatibility. Eventra is designed to closely resemble Node.JS Event Emitters so that you can very easily and quickly switch between the two.

# Type Safety
With the ability to use this library with in TypeScript, we have given you the ability to add type definitions directly into the Event Emitter.  Once you have added your types, you can very quickly and very easily begin using your type safe events.

### Type Safe Implementation
```ts
// Declare your events interface
interface MyEvents {
  'greeting': (message: string) => void;
}

const eventra = new Eventra<MyEvents>();

// Create your event listener
eventra.on('greeting', (msg) => {
  console.log("Received a greeting message:", msg);
});

// Emit your new event
eventra.emit('greeting', "Hello User");
```

# JavaScript Implementation
To implement this into your JavaScript application, it is a very similar process to the one listed above.  Simply declare your event emitter and start using it.

### Plain JavaScript example
```js
const eventra = new Eventra();

// Create your event listener
eventra.on('greeting', (msg) => {
  console.log("Received a greeting message:", msg);
});

// Emit your new event
eventra.emit('greeting', "Hello User");
```

# Browser Implementation
When we ship this library, we also ship it with a bundled version so that you may simply slot it into the browser. To do so you can use the `Eventra` namespace and call the class from that. Here is an example as such:

### Browser Example
```html
<script src='https://cdn.jsdelivr.net/gh/duxcore/eventra@v1.0.1/dist/eventra.min.js'></script>
<script>
  const eventra = new Eventra.Eventra();

  eventra.on("interval", () => {
    console.log("Interval Event Triggered");
  });

  eventra.once("singular", () => {
    console.log("Singular Event Triggered");
  });
  
  setInterval(() => {
    eventra.emit('interval');
    eventra.emit('singular');
  }, 1000)

</script>
```
<br />

> This package uses [discordjs/collection](https://github.com/discordjs/collection) as the internal storage controller and is distrobuted with each copy of this library.