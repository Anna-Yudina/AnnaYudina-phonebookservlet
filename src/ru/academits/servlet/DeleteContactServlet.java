package ru.academits.servlet;

import ru.academits.PhoneBook;
import ru.academits.coverter.ContactConverter;
import ru.academits.service.ContactService;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.stream.Collectors;

public class DeleteContactServlet extends HttpServlet {
    private ContactService phoneBookService = PhoneBook.phoneBookService;
    private ContactConverter contactConverter = PhoneBook.contactConverter;

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        try {
            int deletedContactId = Integer.parseInt(req.getReader().lines().collect(Collectors.toList()).get(0));
            phoneBookService.deleteContact(deletedContactId);

        } catch (Exception e) {
            System.out.println("error in DeleteContactServlet POST: ");
            e.printStackTrace();
        }
    }
}
