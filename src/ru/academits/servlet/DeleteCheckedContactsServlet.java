package ru.academits.servlet;

import ru.academits.PhoneBook;
import ru.academits.coverter.ContactConverter;
import ru.academits.coverter.ListConverter;
import ru.academits.service.ContactService;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.stream.Collectors;

public class DeleteCheckedContactsServlet extends HttpServlet {
    private ContactService phoneBookService = PhoneBook.phoneBookService;
    private ContactConverter contactConverter = PhoneBook.contactConverter;
    private ListConverter listConverter = PhoneBook.listConverter;

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        try {
            String contactIdsString = req.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            ArrayList<Integer> deletedContactIds = listConverter.convertFormJson(contactIdsString);

            phoneBookService.deleteCheckedContacts(deletedContactIds);

        } catch (Exception e) {
            System.out.println("error in DeleteCheckedContactsServlet POST: ");
            e.printStackTrace();
        }
    }
}
