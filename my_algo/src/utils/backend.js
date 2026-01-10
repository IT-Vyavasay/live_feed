/* Use only Common function which is relivent to databse */
import fs from "fs";
import { cookies, headers } from 'next/headers'
import { session } from '../utils/session';
import { getToken } from "next-auth/jwt"
import { sql_query } from "./dbconnect"


export async function check_admin_login(req) {
	let id = null, status = false
	try {
		let authData = await getToken({ req: req })
		if (authData && authData.email && authData.id) {
			let admin = await sql_query("select email,slrAdminId from tblslr_admin where email = ? AND slrAdminId = ? ", [authData.email, authData.id])
			if (admin) {
				id = admin.slrAdminId
				status = true
			}
		}
	} catch (e) {
		console.log("admin login==>", e)
	}
	return { status: status, data: { id: id } }
}

export const setCookie_ = (key, data, isBackend = true) => {
	cookies().set({
		name: key,
		value: data,
		httpOnly: isBackend,
		maxAge: 60 * 60 * 24,
		path: '/',
		domain: process.env.TESTNET == 'false' ? 'domain_name' : 'localhost:2205',
		sameSite: 'none',
		secure: true
	})
}

export const getCookie_ = (key) => {
	return cookies().get(key)
}

export const set_session = async (key, data) => {
	return await session().set(key, data)
}

export const get_session = async (key) => {
	return await session().get(key)
}

export async function recaptcha(token) {
	return true
	const secret = process.env.SECRET_KEY;
	console.log("secret", secret)
	const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
		method: "POST",
	});
	const data = await response.json();
	return data.success;
}

export async function file_get_contents(uri) {
	let res = await fetch(uri)
	let ress = await res.text()
	return ress
}

export async function setLoginHistory(userId, userType, isMobile = 0) {
	try {
		let headersList = headers()
		let useragent = headersList.get('user-agent')
		let clientIP = (headersList.get('x-forwarded-for') || '').split(',').shift().trim() || '-'
		let browser_array = [{ name: "msie", value: "Internet Explorer" }, { name: "firefox", value: "Firefox" }, { name: "safari", value: "Safari" }, { name: "chrome", value: "Chrome" }, { name: "edge", value: "Edge" }, { name: "opera", value: "Opera" }, { name: "netscape", value: "Netscape" }, { name: "maxthon", value: "Maxthon" }, { name: "konqueror", value: "Konqueror" }, { name: "mobile", value: "Handheld Browser" },]
		let browserName = ""
		browser_array.map((c, k) => {
			if (useragent.match(c.name) || useragent.toLowerCase().match(c.name)) {
				browserName = c.value
			}
		})
		let os_array = [{ name: "windows nt 10", value: "Windows 10" }, { name: "windows nt 6.3", value: "Windows 8.1" }, { name: "windows nt 6.2", value: "Windows 8" }, { name: "windows nt 6.1/i", value: "Windows 7" }, { name: "windows nt 6.0", value: "Windows Vista" }, { name: "windows nt 5.2", value: "Windows Server 2003/XP x64" }, { name: "windows nt 5.1", value: "Windows XP" }, { name: "windows xp", value: "Windows XP" }, { name: "windows nt 5.0", value: "Windows 2000" }, { name: "windows me", value: "Windows ME" }, { name: "win98", value: "Windows 98" }, { name: "android", value: "Android" }, { name: "blackberry", value: "BlackBerry" }, { name: "webos", value: "Mobile" }, { name: 'macintosh|mac os x', value: 'Mac OS X' }, { name: 'mac_powerpc', value: 'Mac OS 9' }, { name: 'linux', value: 'Linux' }, { name: 'ubuntu', value: 'Ubuntu' }, { name: 'iphone', value: 'iPhone' }, { name: 'ipod', value: 'iPod' }, { name: 'ipad', value: 'iPad' }]
		let osName = ""
		os_array.map((c, k) => {
			if (useragent.match(c.name) || useragent.toLowerCase().match(c.name)) {
				osName = c.value
			}
		})
		let parentOS = ""
		if (useragent.indexOf("Win") != -1) {
			parentOS = "Window";
		} else if (useragent.indexOf("Android") != -1) {
			parentOS = "Android";
		} else if (useragent.indexOf("Linux") != -1) {
			parentOS = "Linux";
		} else if (useragent.indexOf("Ubuntu") != -1) {
			parentOS = "Ubuntu";
		} else if (
			useragent.indexOf("iphone") != -1 ||
			useragent.indexOf("ipod") != -1 ||
			useragent.indexOf("ipad") != -1
		) {
			parentOS = "IOS";
		} else if (useragent.indexOf("Blackberry") != -1) {
			parentOS = "Blackberry";
		} else if (useragent.indexOf("Webos") != -1) {
			parentOS = "Mobile";
		} else if (useragent.indexOf("Mac") != -1) {
			parentOS = "Mac";
		}
		let location = {}
		let rs = await file_get_contents("http://ip-api.com/json/" + clientIP)
		if (rs) {
			let location_arr = JSON.parse(rs);
			location = {
				city: Object.hasOwn(location_arr, "city") ? location_arr.city : "",
				regionName: Object.hasOwn(location_arr, "regionName")
					? location_arr.regionName
					: "",
				country: Object.hasOwn(location_arr, "country")
					? location_arr.country
					: "",
				lat: Object.hasOwn(location_arr, "lat") ? location_arr.lat : "",
				lon: Object.hasOwn(location_arr, "lon") ? location_arr.lon : "",
				timezone: Object.hasOwn(location_arr, "timezone")
					? location_arr.timezone
					: "",
				zip: Object.hasOwn(location_arr, "zip") ? location_arr.zip : "",
			}
		}
		let loc = location ? JSON.stringify(location) : {}
		let time = Math.floor(Date.now() / 1000)
		let data = [userId, useragent, browserName, clientIP, osName, parentOS, userType, isMobile, loc, time]
		await sql_query("insert into tblslr_loginHistory (userId,userAgent,browserName,clientIP,oSName,parentOS,userType,isMobile,location,loginDate) values (?,?,?,?,?,?,?,?,?,?)", data)
	} catch (e) {
		console.log("setLoginHistory===>", e.message)
	}
}

export async function send_mail(email, subject, mailData) {

	try {
		mailData = {
			...mailData,
			logo: process.env.BASEURL + '/assets/images/logo/logo.png',
			baseUrl: process.env.FRONT_URL,
			image: mailData.image ? process.env.FRONT_URL + '/assets/images/mail/' + mailData.image : '',
			sitename: process.env.SITENAME
		}

		const ejs = require('ejs')
		const template = fs.readFileSync('mail.html', { encoding: 'utf-8' })
		if (process.env.TESTNET == "true") {
			const mailer = require('nodemailer')
			const transporter = mailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'raininfotech22@gmail.com',
					pass: 'pxry wbxg fryj usbt',
				},
			})
			const mailOptions = {
				from: 'raininfotech22@gmail.com',
				to: email,
				subject: subject,
				html: ejs.render(template, mailData),
			}
			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
				} else {
				}
			});
			return true
		} else {
			let data = {
				From: process.env.EMAIL_USER,
				To: email,
				Subject: subject,
				HtmlBody: ejs.render(template, mailData),
				MessageStream: "outbound"
			}
			let mld = await fetch("https://api.postmarkapp.com/email", {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'X-Postmark-Server-Token': process.env.EMAIL_PASSWORD
				}
			})
			let mlData = await mld.json()
			console.log("send mail function--", mlData, mlData?.ErrorCode);
			if (mlData?.ErrorCode == 0) {
				return true
			} else {
				return false
			}
		}
	} catch (e) {
		console.log("send mail function--", e);
		return false
	}
}

export const sendVarificationMail = async (email, subject) => {
	try {
		let mailDescription = `<div>We hope this message finds you well!</div>
			<div style="margin-top: 10px;">Congratulations! Your account has been successfully verified. You can now enjoy full access to all the features and services we offer.</div>
			`
		let mailTitle1 = ` ${subject}`
		let mailTitle = `${subject}`
		let mailImage = 'verify-email.png'
		send_mail(email, ` ${subject}`, { "des": mailDescription, "title1": mailTitle1, "title": mailTitle, "image": mailImage, "otp": '', "otpStyle": 'none', })
	} catch (e) {
		console.log("e send news letter mail---", e);
	}
	return false
}