// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

    const contain = document.getElementById('container')
    const display = document.getElementById('display')
    const lastData = document.getElementById("lastData")

    const imgLcdBox = document.getElementById("lcdBox")
    const imgSwitchUp = document.getElementById("switchUp")
    const imgSwitchDn = document.getElementById("switchDn")
    const imgButtonDn = document.getElementById("buttonDn")

    const context = display.getContext('2d')

    const dataSwitches = [
        { x: 850, y: 480, s: false },
        { x: 750, y: 480, s: false },
        { x: 650, y: 480, s: false },
        { x: 550, y: 480, s: false },
        { x: 450, y: 480, s: false },
        { x: 350, y: 480, s: false },
        { x: 250, y: 480, s: false },
        { x: 150, y: 480, s: false },
    ]

    const modeSwitch = {
        x: 972, y: 228, s: false
    }

    const commitButton = {
        x: 972, y: 480, s: false
    }

    const getMousePos = function(evt) {
        let rect = display.getBoundingClientRect()

        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        }
    }

    const getMouseDist = function(evt, target) {
        let pos = getMousePos(evt)
        let dx = Math.abs(pos.x - target.x)
        let dy = Math.abs(pos.y - target.y)

        return Math.sqrt(dx * dx + dy * dy)
    }

    const getDataValue = function() {
        let data = 0

        for (let i = 0; i < dataSwitches.length; ++i) {
            data |= (dataSwitches[i].s ? 1 : 0) << i
        }

        return data
    }

    let lcd = null

    const doCommit = function() {
        // Check Instruction mode
        if (modeSwitch.s)
        {
            lcd.sendCommand(getDataValue())
        } else // Data mode
        {
            lcd.writeByte(getDataValue())
        }
    }

    let xOff = 0
    let yOff = 0
    let scale = 1.0

    // Just render the display
    let lcdLoop = function() {
        let width = display.width * 0.80
        let height = display.height * 0.90

        // Check LCD
        if (lcd != null) {
            // Determine bezel image size
            xOff = display.width * 0.18
            yOff = display.height * 0.05

            scale = Math.min(height / imgLcdBox.height, width / imgLcdBox.width)

            // Render the lcd screen
            lcd.render(context, xOff + (351 * scale), yOff + (195 * scale), 522 * scale, 173 * scale)

            // Render the bezel
            context.drawImage(imgLcdBox, xOff, yOff, imgLcdBox.width * scale, imgLcdBox.height * scale)

            for (let i = 0; i < dataSwitches.length; ++i) {
                let swImg = dataSwitches[i].s ? imgSwitchUp : imgSwitchDn

                context.drawImage(swImg, xOff + dataSwitches[i].x * scale, yOff + dataSwitches[i].y * scale,
                    swImg.width * scale, swImg.height * scale)
            }

            let modeImg = modeSwitch.s ? imgSwitchUp : imgSwitchDn

            context.drawImage(modeImg, xOff + modeSwitch.x * scale, yOff + modeSwitch.y * scale,
                modeImg.width * scale, modeImg.height * scale)

            if (commitButton.s) {
                context.drawImage(imgButtonDn, xOff + commitButton.x * scale, yOff + commitButton.y * scale,
                    imgButtonDn.width * scale, imgButtonDn.height * scale)
            }
        }

        requestAnimationFrame(lcdLoop)
    }

    setCharData = function(char) {
        let bin = parseInt(char).toString(2).padStart(8, '0')

        modeSwitch.s = false;

        for (let i = bin.length - 1; i >= 0 ; --i) {
            dataSwitches[(bin.length - 1) - i].s = !!parseInt(bin[i])
        }

        lcd.writeByte(char)
        setCurrentData()
    }

    setCurrentData = function() {
        let value = getDataValue()
        let helpText = "Current data:" +
            " h:[ " + value.toString(16).padStart(2, '0') + " ]" +
            " b:[ " + value.toString(2).padStart(8, '0') + " ]" +
            " d:[ " + value.toString() + " ]"

        if (value >= 32 && value <= 127) {
            helpText += " a:[ " + String.fromCharCode(value) + " ]"
        }

        lastData.innerText = helpText
    }

    let buttonHit = function(evt, button) {
        return getMouseDist(evt, {
            x: xOff + (button.x + 45) * scale,
            y: yOff + (button.y + 45) * scale
        }) < 45 * scale
    }

    let setCursor = function(evt) {
        display.title = ""
        display.style.cursor = "default"

        if (buttonHit(evt, commitButton)) {
            display.style.cursor = "grab"
            display.title = "Commit " + (modeSwitch.s ? "instruction" : "data")
        } else if (buttonHit(evt, modeSwitch)) {
            display.style.cursor = "grab"
            display.title = "Switch to " + (modeSwitch.s ? "data" : "instruction") + " mode"
        } else {
            for (let i = 0; i < dataSwitches.length; ++i) {
                if (buttonHit(evt, dataSwitches[i])) {
                    display.style.cursor = "grab"
                    display.title = "Toggle data bit " + i + " " + (dataSwitches[i].s ? "off" : "on")
                }
            }
        }
    }

    // Resize the canvas according to the window size
    let resizeCanvas = function() {
        display.width = contain.getBoundingClientRect().width
        display.height = display.width * 0.5
    }

    // When the LCD engine is loaded, call this
    vrEmuLcd.setLoadedCallback(function() {
        // Create a new LCD object
        lcd = vrEmuLcd.newLCD(20, 4, vrEmuLcd.CharacterRom.A00)

        // Set the color scheme
        lcd.colorScheme = vrEmuLcd.Schemes.WhiteOnBlue

        // Set up the display
        lcd.sendCommand(LCD_CMD_DISPLAY | LCD_CMD_DISPLAY_ON | LCD_CMD_DISPLAY_CURSOR | LCD_CMD_DISPLAY_CURSOR_BLINK)
        lcd.sendCommand(LCD_CMD_CLEAR)

        // Output some text
        let msg = "Electron LCD Emulat.Hello, World!!!"

        lcd.writeString(msg)

        // Run the display loop
        requestAnimationFrame(lcdLoop)
    })

    display.addEventListener('click', function(evt) {
        // Check Switch
        if (buttonHit(evt, modeSwitch)) {
            modeSwitch.s = !modeSwitch.s
        } else {
            for (let i = 0; i < dataSwitches.length; ++i) {
                if (buttonHit(evt, dataSwitches[i])) {
                    dataSwitches[i].s = !dataSwitches[i].s
                }
            }

            setCurrentData()
        }
    }, false)

    display.addEventListener('mousemove', function(evt) {
        // Check button area
        if (!buttonHit(evt, commitButton)) {
            commitButton.s = false
        }

        setCursor(evt)
    }, false)

    display.addEventListener('mousedown', function(evt) {
        // Check button click
        if (buttonHit(evt, commitButton)) {
            commitButton.s = true
            doCommit()
        }

        if (display.style.cursor == "grab") {
            display.style.cursor = "grabbing"
        }
    }, false)

    display.addEventListener('mouseup', function(evt) {
        commitButton.s = false
        setCursor(evt)
    }, false)

    // Handle key events
    document.addEventListener('keydown', function(e) {
        if (e.key == "ArrowLeft") {
            lcd.sendCommand(LCD_CMD_SHIFT | LCD_CMD_SHIFT_LEFT |
                (e.shiftKey ? LCD_CMD_SHIFT_DISPLAY : LCD_CMD_SHIFT_CURSOR))
        } else if (e.key == "ArrowRight") {
            lcd.sendCommand(LCD_CMD_SHIFT | LCD_CMD_SHIFT_RIGHT |
                (e.shiftKey ? LCD_CMD_SHIFT_DISPLAY : LCD_CMD_SHIFT_CURSOR))
        } else if (e.key == "ArrowDown") {
            for (let i = 0; i < 20; ++i) {
                lcd.sendCommand(LCD_CMD_SHIFT | LCD_CMD_SHIFT_RIGHT | LCD_CMD_SHIFT_CURSOR)
            }
        } else if (e.key == "ArrowUp") {
            for (let i = 0; i < 20; ++i) {
                lcd.sendCommand(LCD_CMD_SHIFT | LCD_CMD_SHIFT_LEFT | LCD_CMD_SHIFT_CURSOR)
            }
        } else if (e.key == "Delete") {
            lcd.writeByte(32)
            lcd.sendCommand(LCD_CMD_SHIFT | LCD_CMD_SHIFT_LEFT)
        } else if (e.key == "Backspace") {
            lcd.sendCommand(LCD_CMD_SHIFT | LCD_CMD_SHIFT_LEFT)
            lcd.writeByte(32)
            lcd.sendCommand(LCD_CMD_SHIFT | LCD_CMD_SHIFT_LEFT)
        } else if (e.key.length == 1 && event.which > 30) {
            let char = e.key.charCodeAt(0)
            setCharData(char)
        }
    })

    // Add fallback
    window.addEventListener('resize', resizeCanvas, false)
    window.addEventListener('focus', resizeCanvas, false)
    window.addEventListener('load', resizeCanvas, false)
})
