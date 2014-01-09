using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;

namespace App_Login
{
    /// <summary>
    /// CheckLogin 的摘要说明
    /// </summary>
    public class CheckLogin : IHttpHandler
    {
        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            string method = "";
            string callback = "";
            if (context.Request["Method"] != null)
            {
                method = context.Request["Method"].ToString();
                callback = context.Request["callback"];
            }
            if (method == "CheckLogin")
            {
                string username = context.Request["username"] == null ? "" : context.Request["username"].ToString();
                string password = context.Request["password"] == null ? "" : context.Request["password"].ToString();
                string response = "";
                using (ShtxSms2008Entities ctx = new ShtxSms2008Entities())
                {
                    CustomerBase customer = ctx.CustomerBases.Where(c => c.Tel == username).FirstOrDefault();
                    if (customer == null)
                    {
                        response = "0";// 用户不存在
                    }
                    else
                    {
                        if (customer.Appsecret != password)
                        {
                            response = "1"; //密码不正确
                        }
                        response = "2";//登陆成功
                    }

                }
                string str = string.Format("\"result\":\"" + response + "\"");
                string call = callback + "({" + str + "})";
                context.Response.Write(call);
            }
            else if (method == "CheckVersion")
            {
                //0不需要升级 ,1需要升级
                string flag = "0";
                float version = context.Request["version"] == null ? 0 : Convert.ToSingle(context.Request["version"]);
                try
                {
                    XmlDocument xmlDoc = new XmlDocument();
                    xmlDoc.Load("http://localhost:51152/Version.xml");
                    XmlNode root = xmlDoc.SelectSingleNode("Version");
                    float newVersion = Convert.ToSingle(root.InnerText);
                    if (newVersion > version)
                    {
                        flag = "1";
                    }
                }
                catch
                {

                }
                string str = string.Format("\"result\":\"" + flag + "\"");
                string call = callback + "({" + str + "})";
                context.Response.Write(call);
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}