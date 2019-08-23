package cn.powerrun.controller;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import cn.powerrun.utils.DateUtils;

public class UploadServlet extends HttpServlet{
	private static final long serialVersionUID = 1L;
	private String uploadPath;
	File tempPathFile;
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		doPost(req,resp);
	}
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//设置存储的路径
		uploadPath = request.getSession().getServletContext().getRealPath("")+"upload"+File.separator + "json" + File.separator + DateUtils.getDateFileName();
		File dir = new File(uploadPath);
		if(!dir.exists()) {
			dir.mkdirs();
		}
		
		try {
			DiskFileItemFactory factory = new DiskFileItemFactory();
			
			// Set factory constraints
			factory.setSizeThreshold(4096); // 设置缓冲区大小，这里是4kb
			factory.setRepository(tempPathFile);// 设置缓冲区目录
			
			// Create a new file upload handler
			ServletFileUpload upload = new ServletFileUpload(factory);
			
			// Set overall request size constraint
			upload.setSizeMax(41943040); // 设置最大文件尺寸，这里是40MB
			
			List<FileItem> items = upload.parseRequest(request);// 得到所有的文件
			Iterator<FileItem> i = items.iterator();
			while(i.hasNext()) {
				FileItem fi = i.next();
				String fileName = fi.getName();
				if (fileName != null) {
					File fullFile = new File(new String(fi.getName().getBytes(), "utf-8")); // 解决文件名乱码问题
					File savedFile = new File(uploadPath, fullFile.getName());
					fi.write(savedFile);
				}
			}
			System.out.println("upload succeed");
		} catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	
}
