//Wait for the page to finish loading
$(function () {
    main();
});

function main() {
    //Bind the click event of the button
    $("#sendMessageButton").on("click", sendMessage);
}

function sendMessage() {
    //Get the value from the input
    let message = $("#messageText").val();

    //Check if the input is not empty
    if (message === "") {
        return;
    }

    //Find the target element for the chat bubbles
    let messageResultElement = $("#messageResult");

    //Create a string with the time and date
    let date = new Date();
    let dateTime = `${date.toDateString()} ${date.toLocaleTimeString()}`;

    //Construct a div and add it as first element
    let myMessage = createChatBubble("me", "Me", dateTime, message);
    messageResultElement.prepend(myMessage);

    //Get a random response for the bot
    $.get("data/responses.json")
        .then(function (data) {
            //Pick a random index
            let randomResponseIndex = Math.floor(Math.random() * data.length);
            let response = data[randomResponseIndex];

            //Get a random color for the bot
            $.get("https://api.noopschallenge.com/hexbot")
                .then(function (hexbot) {
                    //Success - Construct a div and add it as first element
                    let botMessage = createChatBubble(
                        "bot", "Bot", dateTime, response
                    );

                    botMessage.css("background-color", hexbot.colors[0].value);

                    messageResultElement.prepend(botMessage);
                })
                .fail(function () {
                    //Error - Construct a div and add it as first element
                    let botMessage = createChatBubble(
                        "bot", "Bot", dateTime, "Something went wrong :("
                    );
                    messageResultElement.prepend(botMessage);
                });
        })
        .fail(function () {
            //Error - Construct a div and add it as first element
            let botMessage = createChatBubble(
                "bot", "Bot", dateTime, "Something went wrong :("
            );
            messageResultElement.prepend(botMessage);
        });
}

function createChatBubble(className, sender, dateTime, message) {
    let chatBubble = $("<div>")
        .addClass("box message")
        .addClass(className)
        .html(`<b>${sender} @ ${dateTime}</b><br />${message}`);

    return chatBubble;
}