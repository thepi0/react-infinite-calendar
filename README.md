# Please note

This is a highly customized version of the Clauderic React Infinite Calendar and not much works like in the original calendar. Clauderic React Infinite Calendar was tremendous help in developing this calendar component.

Original calendar: https://github.com/clauderic/react-infinite-calendar


<div style="padding:30px">
<img src="https://raw.githubusercontent.com/clauderic/react-infinite-calendar/master/.github/preview.gif" width="300" />
</div>

Getting Started
---------------

Install component to your project
```
npm install https://github.com/thepi0/react-infinite-calendar.git#production --save
```


Usage
------------
### Basic Example

```js
import React from 'react';
import { render } from 'react-dom';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // only needs to be imported once

render(
  <InfiniteCalendar
    width={400}
    height={600}
    selected={null}
  />,
  document.getElementById('root')
);
```
There is a lot of custom properties which will not be listed here.

## Demo and Storybook

- `npm start` will run a development server with the component's demo app at [http://localhost:3000](http://localhost:3000) with hot module reloading. (doesn't work properly with this custom component)

- `npm run storybook` will run the storybook showcasing different states of the app at [http://localhost:9001](http://localhost:9001) with hot module reloading.


## Building and releasing

- `npm run build` will build the component for publishing and also bundle the demo app. (You might have to run this twice - some bug here)

After building you can normally push to git under the production repo.


License
---------
The original *react-infinite-calendar* is available under the MIT License.
