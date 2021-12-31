module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '1b5f524eaa230cf7ea6d4f82753ef417'),
  },
});
