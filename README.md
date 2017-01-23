# NES-Synth JS

Very early development. Currently just a little UI and some setup. Sound is not working yet.
It started to get fairly complicated, fairly quickly. This is intended to be a component of the nes-editor I'm working on. But, I also would like
to make it as stand alone as possible for now. Now with webworker for sequencer clock. Current has set note fequency
for each different synth. Need to figure out noise (not so easy on web audio, this might end up being the hardest part).

`npm install` or `yarn install`
`npm run dev` or `yarn dev` to start dev server

just push sequencer buttons on and off and hit play. Will change while it's playing.

Now you can select different note values for each note. Right click on the note to make that
the current note, then select the value below.
