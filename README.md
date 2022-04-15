# sharc

sharc is a minimalistic bookmarking tool that archives the pages locally at your device and organizes them in a simple web interface. The download of the files is only based on wget - it has no other dependencies!

## Setup
To understand the logic behind the setup, it is advisable to look into the files `archive`, `assets/main.js` and `setup`.

In `archive` at the top you can see the line

```sh
dir="%dir%" && cd "$dir"
```

and in `assets/main.js` the first two lines are:

```js
const locale = "%locale%";
const timeZone = "%timeZone%";
```

These are the environment variables that have to be set before you can use the program. You can either do it manually or simply run the setup script:

```sh
./setup
```

The script sets `%dir%` based on the directory you are currently in (e.g. /srv/http/archive) and `%locale%` and `%timeZone%` based respectively on your locale (e.g. en-GB) and [timezone](https://www.iana.org/time-zones) (e.g. Australia/Sydney).

Now copy `archive` to /usr/local/bin:
```sh
sudo cp archive /usr/local/bin
```

## How to use
Using it is very simple and intuitive. Every time you want to archive a page, you run
```sh
archive <link>
```
in your terminal. This downloads the page and adds the link in links.js.

To get to the overview page, either open index.html in the browser or – if you have a web server installed locally – navigate to http://localhost/archive (or whatever your path is).

## How it's organized
In addition to the date and the link, you can see a third column in the table that shows the number of snapshots of the URL.

![Overview of all archived links](assets/img/01.png)

If you click on the number, you will get to a subpage with all snapshots of the particular link.

![Overview of all snapshots of a link](assets/img/02.png)

Below that, there is a link to a subpage to see an overview of all archived URLs of the respective domain.

![Overview of all URLs of a domain](assets/img/03.png)

## Hosting a sharc instance
What if you don't want to save the archive on your local machine, but on your server and make it accessible to the world, is that possible? **Yes!**

There are probably several ways you could do it, but here's a simple way I can recommend:

1. Download/clone the repo to a directory of choice (e.g. /var/www/html/archive) and do the setup as described above
2. Then add a file named `archive` on your **local** machine with the following content:

```sh
#!/bin/sh

ssh <user>@<hostname> "archive $1; exit"
```
Replace `<user>` with your SSH username and `<hostname>`  with the IP or address of your site.

3. Make the file executable:
```sh
sudo chmod +x archive
```
4. Move the file to /usr/local/bin
```sh
sudo mv archive /usr/local/bin
```

That's it! Now every time you want to add a page to your archive, simply run the following command on your local machine:

```sh
archive <site>
```

The page will be downloaded on your server and will be publicly visible at the URL you chose above (e.g. https://example.com/archive).
