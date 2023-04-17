package ru.academits.dao;

import ru.academits.model.Contact;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Created by Anna on 17.06.2017.
 */
public class ContactDao {
    private List<Contact> contactList = new ArrayList<>();
    private AtomicInteger idSequence = new AtomicInteger(0);

    public ContactDao() {
        Contact contact = new Contact(getNewId(), "Иван", "Иванов", "9123456789");
        contactList.add(contact);
    }

    private int getNewId() {
        return idSequence.addAndGet(1);
    }

    public List<Contact> getAllContacts() {
        return contactList;
    }

    public void add(Contact contact) {
        contact.setId(getNewId());
        contactList.add(contact);
    }

    public void deleteContact(int deletedContactId) {
        contactList = contactList.stream().filter(c -> c.getId() != deletedContactId).collect(Collectors.toList());
        System.out.println(contactList);
    }

    public void deleteCheckedContacts(ArrayList<Integer> checkedContactsIds) {
        contactList = contactList.stream().filter(c -> !checkedContactsIds.contains(c.getId())).collect(Collectors.toList());
    }
}
