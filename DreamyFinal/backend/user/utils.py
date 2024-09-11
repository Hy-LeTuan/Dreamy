import pyotp
import datetime


def generate_email(username, otp_code, interval: int = 30):
    """
    Argument 
    interval: time in seconds until the OTP expired
    """

    return f"""
    <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset OTP</title>
  </head>
  <body
    style="
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      font-family: 'Lora', 'Roboto', 'Times New Roman', Times, serif;
    "
  >
    <center
      class="wrapper"
      style="
        box-sizing: border-box;
        width: 100%;
        table-layout: fixed;
        background-color: #f4f4f4;
        padding: 20px;
      "
    >
      <table
        class="main"
        width="100%"
        style="
          border-spacing: 0;
          box-sizing: border-box;
          border: 10px solid #439a97;
          border-radius: 10px;
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        "
      >
        <tr class="main__header">
          <td style="padding: 0; border-bottom: 5px solid #439a97">
            <img
              style="
                display: block;
                box-sizing: border-box;
                width: 100%;
                height: auto;
                max-width: 600px;
              "
              src="https://assets.unlayer.com/projects/110127/1666969734089-323165.png"
              alt="Password Reset"
            />
          </td>
        </tr>

        <tr class="main__content">
          <td style="padding: 20px; text-align: center;">
            <h1 style="color: #2c74b3; font-size: 24px;">Password Reset</h1>
            <p style="font-size: 16px; color: hsl(221, 52%, 42%); line-height: 1.5;">
              Hi <strong>{username}</strong>, <br /><br />
              We received a request to reset your password. Please use the OTP code
              below to reset it:
            </p>

            <div
              style="
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                background-color: #439a97;
                color: white;
                font-size: 24px;
                font-weight: bold;
                border-radius: 5px;
                letter-spacing: 5px;
              "
            >
              {otp_code}
            </div>

            <p style="font-size: 16px; color: hsl(221, 52%, 42%); line-height: 1.5;">
              This OTP code will expire in {interval} seconds. If you did not request a password
              reset, please ignore this email or contact support.
            </p>

            <a
              href="[RESET LINK]"
              style="
                display: inline-block;
                padding: 10px 20px;
                background-color: #fc5185;
                color: white;
                text-decoration: none;
                font-size: 16px;
                font-weight: bold;
                border-radius: 5px;
                margin-top: 10px;
              "
              >Reset Password</a
            >
          </td>
        </tr>

        <tr class="main__footer" style="text-align: center; padding: 20px;">
          <td>
            <div
              style="
                border-top: 1px solid #3c4048;
                width: 60%;
                margin: 10px auto;
              "
            ></div>
            <p style="font-size: 14px; color: #3c4048;">
              If you have any questions, feel free to <a href="mailto:support@yourwebsite.com" style="color: #3fc1c9;">contact us</a>.
            </p>
            <div
              class="container-logo"
              style="
                margin: 10px 0;
                padding-top: 10px;
                padding-bottom: 10px;
              "
            >
            </div>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
"""


def generate_otp_secret():
    return pyotp.random_base32()


def get_totp(otp_secret):
    return pyotp.TOTP(otp_secret)


def verify_otp(otp, user_typed_otp):
    return otp == user_typed_otp


def verify_otp_time(stored_time: str, interval=30):
    """
    stored_time: the time that the OTP is sent to the user in ISO date time format 
    """
    stored_time_converted = datetime.datetime.fromisoformat(stored_time)

    time_difference = datetime.datetime.now() - stored_time_converted

    if (time_difference.days <= 0 and time_difference.seconds <= interval):
        return True
    else:
        return False
