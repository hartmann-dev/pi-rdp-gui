const { ipcRenderer } = require('electron');
const spawn = require("child_process").spawn;
window.$ = window.jQuery = require('jquery');

let config;

ipcRenderer.send('get-config');
ipcRenderer.on('send-config', (event, arg) => {
    config = arg;
});

(function(app) {
    app(window.jQuery, window, document, config, spawn);
}(function($, window, document) {
    $(function() {
        debug("config: " + JSON.stringify(config));
        const domain = $('#domain-target');
        domain.html(config.domain);
        
        const footer = $('#footer');
        footer.html("<p>" + config.copyright + "</p>");

        if(config.debug){
            const debug = $('#debug');
            debug.css({
                display: "block",
            });
            const container = $('#container');
            container.css({
                marginTop: "-200px",                
            });
        }

        $("#login-form").submit((e) => {
            e.preventDefault();
            $("#msg").hide();
            const username = $( "input[name='username']" ).val();
            const password = $( "input[name='password']" ).val();

            //debug("Benutzername: " +  username);
            //debug("Passwort: " +  password);
            if(username && password){
                const args = get_command(username, password);
                const repsone = exec_cmd(config.command.binary, args);
                debug(response);

                                
            } else {
                if(!username)
                    debug("Benutzername nicht gesetzt");
                if(!password)
                    debug("Kenntwort nicht gesetzt");
                print_msg("Benutzername und Kennwort dürfen nicht leer sein.", "error");
                
            }
            


        });
    });
    let debugLine= 0;
    const debug = (msg) => {
        if(config.debug){
            const debug = $('#debug');
            if(typeof msg === 'object')
                msg = JSON.stringify(msg);
            debug.append("<li>" + ++debugLine + ": " + msg + "</li>" );
            debug.animate({ scrollTop: debug[0].scrollHeight}, 200);
        }
    }

    const print_msg = (msg, type) => {
        $("#msg").html(`<li class="${type}">${msg}</li>`).show();
    }

    const get_command = (username, password) => {
        const cmd_config = config.command;
        command = [`${cmd_config.username}${username}`, `${cmd_config.password}${password}`]
        if(cmd_config.args)
           command = command.concat(cmd_config.args);
        return command;
    }
    const exec_cmd = (cmd, args) => {
        const ls = spawn(cmd, args);
        debug(`exec commmand ${cmd} ${args.join( " " )}`);
        
        ls.stdout.on('data', (data) => {
            debug(`stdout: ${data}`);
        });
        
        ls.stderr.on('data', (data) => {
            debug(`stderr: ${data}`);
        });
        
        ls.on('close', (code) => {
            debug(`child process exited with code ${code}`);
        });
        return "a";
    }
}));