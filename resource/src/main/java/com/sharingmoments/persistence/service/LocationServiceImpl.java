package com.sharingmoments.persistence.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sharingmoments.persistence.doa.LocationRepository;
import com.sharingmoments.persistence.model.Location;

@Service
@Transactional
public class LocationServiceImpl implements LocationService {
	
	@Autowired
    private LocationRepository repository;

	@Override
	public Location getLocationByID(UUID id) {
		return repository.findOne(id);
	}

	@Override
	public Location saveLocation(Location location) {
		return repository.save(location);
	}

	@Override
	public Location getLocationByGoogleLocationID(String googleLocationID) {
		return repository.findByGoogleLocationID(googleLocationID);
	}

}