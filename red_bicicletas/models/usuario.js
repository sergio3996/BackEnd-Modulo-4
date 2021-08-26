var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;
const Token = require('./token')
const crypto = require('crypto');
const mailer = require("../mailer/mailer");
const bcrypt = require('bcrypt');

const saltRounds = 10;

const validateEmail = function(email){
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email)
}

var usuarioSchema = new Schema ({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor, ingrese un email valido'],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/]
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario' });

usuarioSchema.pre('save', function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}

usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    console.log(reserva);
    reserva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return console.log(err.message); }

        const mailOptions = {
            from: 'sergio3996@hotmail.com',
            to: email_destination,
            subject: 'Verificación de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '.\n'
        };

        mailer.sendMail(mailOptions, function(err) {
            if (err) { return console.log(err.message); }

            console.log('Se ha enviado un email de bienvenida a: '+ email_destination + '.' );
        });
    });
}

usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err) {
        if (err) { return cb(err); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Reseteo de password de cuenta ',
            text: 'Hola,\n\n' + 'Por favor, para resetear el password de su cuenta haga click en este link: \n' + ' http://localhost:5001' + '\/resetPassword\/' + token.token + '.\n'
        };
        
        mailer.sendMail(mailOptions, function (err){
            if (err) { return cb(err); }

            console.log('Se envio un email para resetear el password a: ' +  email_destination + '.');
        });
        
        cb(null);
    });
}

module.exports = mongoose.model('Usuario', usuarioSchema);